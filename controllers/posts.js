require('dotenv');
const Post = require('../models/post');
// const mbxGeocoding = require ('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const { imageDelete } = require('../cloudinary');


module.exports = {
    //posts index
    async postIndex(req,res,next) {
        const { dbQuery } = res.locals;
        delete res.locals.dbQuery;
        let posts = await Post.paginate(dbquery,{
            page: req.query.page || 1,
            limit: 10,
            sort:'-_id'
        })
        .populate({
            path:'author',
            ref:'User'
        });
        posts.page = Number(posts.page);
        console.log(posts.length+' posts found');
        if(!posts.docs.length && res.locals.query) {
            res.locals.error = 'No results match that search.';
        }
        res.render('posts/index',{posts, mapBoxToken, title: 'SurfShop - All Posts', page:'all_posts' });
    },
    //new post page
    postNew(req,res,next) {
        res.render('posts/new', { title: 'SurfShop - New Post', page:'new_post' });
    },
    //create new post
    async postCreate(req, res, next) {
        req.body.post.images=[];
        if(req.files && req.files.length) {
            for (const file of req.files) {
                req.body.post.images.push({url:file.secure_url,public_id:file.public_id});
            }
        }
        let post = new Post(req.body.post);
        await post.getCoordinates(req.body.post.location);
        post.author=req.user._id;
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
        req.session.success="Post Created!";
		res.redirect(`/posts/${post.id}`);
	},
    //show single post
    async postShow (req,res,next) {
        post = await Post.findById(req.params.id).populate({
            path:'reviews',
            model:'Review',
            options:{sort: {'_id':-1}},
            populate:{
                path:'author',
                model:'User'
            }
        });
        const floorRating = post.calculateAverageRating();
        res.render('posts/show',{post, mapBoxToken, floorRating, title: 'SurfShop - View '+post.title, page:'view_post' });
    },
    //edit post
    postEdit (req,res,next) {
        res.render('posts/edit',{ title: 'SurfShop - Edit '+post.title, page:'edit_post' });
    },
    // Posts Update
	async postUpdate(req, res, next) {
		// destructure post from res.locals
		const {post} = res.locals;
		// check if there are any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {			
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages) {
				// delete images from cloudinary & remove from post images array
                await imageDelete(public_id, post);
			}
		}
		// check if there are any new images for upload
		if(req.files) {
            // post.images.push(await imageUpload(req.files));
			// upload images
			for(const file of req.files) {
				post.images.push({url:file.secure_url,public_id:file.public_id});
			}
		}
		// update the post with any new properties
		post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        post.price = req.body.post.price;
        // check if location was updated
        if (post.location !== req.body.post.location) {
            console.log('location has changed')
            //if so, get new corrdinates and apply to post
            await post.getCoordinates(req.body.post.location);
        }
		// save the updated post into the db
		await post.save();
        // redirect to show page
        req.session.success='Post Updated!';
        req.flash('success','Post Updated!');
		res.redirect(`/posts/${post.id}`);
	},
    async postDestroy (req,res,next) {
        // destructure post from res.locals
		const {post} = res.locals;
        //remove all images from the post
        for (const image of post.images) {
            await imageDelete(image.public_id, post);
        }
        //calling remove separately from findbyId because the pre hook in the post model to delete reviews associated with the post will only fire on the found document itself, not on querying the model
        await post.remove();
        req.session.success='Post Deleted!';
        res.redirect('/posts/');
    }
}