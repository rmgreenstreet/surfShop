require('dotenv');
const Post = require('../models/post');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const { imageDelete } = require('../cloudinary');


module.exports = {
    //GET posts index
    async postIndex(req,res,next) {
        //get any search provided by the user, if it exists
        const { dbQuery } = res.locals;
        //remove the search from the session
        delete res.locals.dbQuery;
        //get all posts, 10 per page, for the current page
        let posts = await Post.paginate(dbQuery,{
            page: req.query.page || 1,
            limit: 10,
            sort:'-_id'
        });
        // set the current page of results
        posts.page = Number(posts.page);
        console.log(posts.docs.length+' posts found');
        if(!posts.docs.length && res.locals.query) {
            res.locals.error = 'No results match that search.';
        }
        /* choose a random post from the 10 shown on the page to 
        use the first image as the header background */
        const randomIndex = await Math.ceil(Math.random()*posts.docs.length);
        res.render('posts/index',{posts, randomIndex, mapBoxToken, title: 'SurfShop - All Posts', page:'all_posts' });
    },
    //new post page
    postNew(req,res,next) {
        res.render('posts/new', { title: 'SurfShop - New Post', page:'new_post' });
    },
    //create new post
    async postCreate(req, res, next) {
        req.body.post.images=[];
        /* if user added images for the post, prepare them to be added to the post object */
        if(req.files && req.files.length) {
            for (const file of req.files) {
                req.body.post.images.push({url:file.secure_url,public_id:file.public_id});
            }
        }
        // create a new post in the database
        let post = new Post(req.body.post);
        // get gps coordinates for the post location
        await post.getCoordinates(req.body.post.location);
        //set the post author
        post.author=req.user._id;
        //Set a short description to be displayed on the post index page
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        //save the post
        await post.save();
        req.session.success="Post Created!";
		res.redirect(`/posts/${post.id}`);
	},
    //show single post
    async postShow (req,res,next) {
        //find the post in the database and populate all of its reviews (and their authors) using their ids
        post = await Post.findOne({slug:req.params.slug}).populate({
            path:'reviews',
            model:'Review',
            options:{sort: {'_id':-1}},
            populate:{
                path:'author',
                model:'User'
            }
        });
        //get the post's rating to show on the page
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