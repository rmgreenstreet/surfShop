
const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const NodeGeocoder = require('node-geocoder');
const Review = require('../models/review');
const User = require('../models/user');


//configure cloudinary upload settings
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

var mapsOptions = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODING_KEY,
    formatter: null
  };
   
  var geocoder = NodeGeocoder(mapsOptions);

async function imageUpload(file,documentType) {
    uploadedImage={};
    let image = await cloudinary.uploader.upload(file.path, {folder:'surf_shop/dev/'+documentType});
    uploadedImage.url=image.secure_url;
    uploadedImage.public_id=image.public_id;
    await fs.unlink(file.path,(err)=>{});
    return uploadedImage;
}

async function imageDelete(public_id) {
    await cloudinary.uploader.destroy(public_id);
}

async function getCoordinates(location) {
    locationObj = {};
    await geocoder.geocode(location, (err, data) => {
		locationObj.lat = data[0].latitude;
		locationObj.lng = data[0].longitude;
        locationObj.formattedAddress = data[0].formattedAddress;
    });
    return locationObj;
}

module.exports = {
    //posts index
    async postIndex(req,res,next) {
        let posts = await Post.paginate({},{
            page: req.query.page || 1,
            limit: 10
        });
        posts.page = Number(posts.page);
        console.log(posts.length+' posts found');
        res.render('posts/index',{posts, title: 'SurfShop - All Posts', page:'all_posts' });
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
                req.body.post.images.push(await imageUpload(file,'post'));
            }
        }
        let post = await Post.create(req.body.post);
        let locationObj = await(getCoordinates(req.body.post.location));
        post.location.formattedAddress = locationObj.formattedAddress;
        post.location.lat = locationObj.lat;
        post.location.lng = locationObj.lng;
        post.author = req.user._id;
        post.save();
        req.session.success="Post Created!";
        req.flash('success','Post Created!');
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
        res.render('posts/show',{post, floorRating, title: 'SurfShop - View '+post.title, page:'view_post' });
    },
    //edit post
    async postEdit (req,res,next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit',{post, title: 'SurfShop - Edit '+post.title, page:'edit_post' });
    },
    // Posts Update
	async postUpdate(req, res, next) {
		// find the post by id
		let post = await Post.findById(req.params.id);
		// check if there are any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {			
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages) {
				// delete images from cloudinary
                imageDelete(public_id);
				// // delete image from post.images
				for(const image of post.images) {
					if(image.public_id === public_id) {
                        let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		// check if there are any new images for upload
		if(req.files) {
            // post.images.push(await imageUpload(req.files));
			// upload images
			for(const file of req.files) {
				let image = await imageUpload(file,'post');
				// add images to post.images array
				post.images.push(image);
			}
		}
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
        post.price = req.body.post.price;
        // check if location was updated
        if (post.location.formattedAddress !== req.body.post.location) {
            console.log('location has changed')
            //if so, get new corrdinates and apply to post
            post.location = await(getCoordinates(req.body.post.location));
        }
		// save the updated post into the db
		post.save();
        // redirect to show page
        req.session.success='Post Updated!';
        req.flash('success','Post Updated!');
		res.redirect(`/posts/${post.id}`);
	},
    async postDestroy (req,res,next) {
        //find the post to be deleted
        let post = await Post.findById(req.params.id);
        //remove all images from the post
        for (const image of post.images) {
            await imageDelete(image.public_id);
        }
        //calling remove separately from findbyId because the pre hook in the post model to delete reviews associated with the post will only fire on the found document itself, not on querying the model
        await post.remove();
        req.session.success='Post Deleted!';
        res.redirect('/posts/');
    }
}