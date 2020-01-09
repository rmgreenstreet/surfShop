const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;


//configure cloudinary upload settings
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function imageUpload(req,documentType,publicId) {
    imageArray=[];
    for(const file of req.files) {
        let image = await cloudinary.uploader.upload(file.path, {folder:'surf_shop/'+documentType,public_id:publicId});
        imageArray.push({
            url:image.secure_url,
            publicId:image.public_id
        });
    }
    return imageArray;
}

async function imageDelete(postId) {
    let post = await Post.findById(postId);
    return await post.images.forEach(image => {
        cloudinary.uploader.destroy(image.publicId);
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
        req.body.post.images = await imageUpload(req,'post');
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
    //put edit post
    async postUpdate (req,res,next) {
        console.log(req.files)
        await imageDelete(req.params.id);
        req.body.post.images = await imageUpload(req,'post');
        let post = await Post.findByIdAndUpdate(req.params.id,req.body.post);
        req.flash('success','Post Updated!');
        res.redirect('/posts/'+post.id);
    },
    async postDestroy (req,res,next) {
        await imageDelete(req.params.id);
        await Post.findByIdAndRemove(req.params.id);
        req.flash('success','Post Deleted!');
        res.redirect('/posts/');
    }
}