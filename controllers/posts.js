
const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;


//configure cloudinary upload settings
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function imageUpload(files,documentType) {
    imageArray=[];
    for(const file of files) {
        let image = await cloudinary.uploader.upload(file.path, {folder:'surf_shop/dev'+documentType});
        imageArray.push({
            url:image.secure_url,
            public_id:image.public_id
        });
    }
    return imageArray;
}

async function imageDelete(postId) {
    let post = await Post.findById(postId);
    return await post.images.forEach(image => {
        cloudinary.uploader.destroy(image.public_id);
    });
}

module.exports = {
    //posts index
    async postIndex(req,res,next) {
        let posts = await Post.find({});
        console.log(posts.length+' posts found');
        res.render('posts/index',{posts});
    },
    //new post page
    postNew(req,res,next) {
        res.render('posts/new');
    },
    //create new post
    async postCreate(req, res, next) {
        req.body.post.images = await imageUpload(req.files,'post');
		let post = await Post.create(req.body.post);
        req.flash('success','Post Created!');
		res.redirect(`/posts/${post.id}`);
	},
    //show single post
    async postShow (req,res,next) {
        post = await Post.findById(req.params.id);
        res.render('posts/show',{post});
    },
    //edit post
    async postEdit (req,res,next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit',{post});
    },
    // Posts Update
	async postUpdate(req, res, next) {
		// find the post by id
		let post = await Post.findById(req.params.id);
		// check if there's any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {			
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages) {
				// delete images from cloudinary
				await cloudinary.uploader.destroy(public_id);
				// delete image from post.images
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
			// upload images
			for(const file of req.files) {
				let image = await cloudinary.uploader.upload(file.path);
				// add images to post.images array
				post.images.push({
					url: image.secure_url,
					public_id: image.public_id
				});
			}
		}
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.price = req.body.post.price;
		post.location = req.body.post.location;
		// save the updated post into the db
		post.save();
		// redirect to show page
		res.redirect(`/posts/${post.id}`);
	},
    async postDestroy (req,res,next) {
        await imageDelete(req.params.id);
        await Post.findByIdAndRemove(req.params.id);
        req.flash('success','Post Deleted!');
        res.redirect('/posts/');
    }
}