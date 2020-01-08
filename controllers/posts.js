const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;



//configure cloudinary upload settings
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

function imageUpload(file,type) {
    cloudinary.uploader.upload(file, {folder:'surf_shop/'+type}, (err,result) => {
        if(err) {
            return console.log(err.message);
        }
        else {
            return result;
        }
    });
}

module.exports = {
    //posts index
    async getPosts(req,res,next) {
        let posts = await Post.find({});
        console.log(posts.length+' posts found');
        res.render('posts/index',{posts});
    },
    //new post page
    async newPost(req,res,next) {
        res.render('posts/new');
    },
    //create new post
    async createPost(req,res,next) {
        let newPost = new Post(req.body.post);
        req.files.forEach(item => {
            let postImage = new imageUpload(item.path,'post');
            newPost.images.push({url:postImage.secure_url,publicId:postImage.public_id});
        });

        await newPost.save();
        res.redirect('posts/'+newPost._id);
    }  
}