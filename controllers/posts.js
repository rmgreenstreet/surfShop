const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;
require('locus');


//configure cloudinary upload settings
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// async imageUpload(file,documentType) {
//     await cloudinary.uploader.upload(file, {folder:'surf_shop/'+documentType}, (err,result) => {
//         if(err) {
//             return console.log(err.message);
//         }
//         else {
//             return result;
//         }
//     });
// }

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
		let post = await Post.create(req.body.post);
		res.redirect(`/posts/${post.id}`);
	},
    // async createPost(req,res,next) {
    //     let newPost = new Post(req.body.post);
    //     req.files.forEach(item => {
    //         let postImage = new imageUpload(item.path,'post');
    //         newPost.images.push({url:postImage.secure_url,publicId:postImage.public_id});
    //     }); 
    //     newPost.save() 
    //     res.redirect('posts/'+newPost._id);
    // },
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
        let post = await Post.findByIdAndUpdate(req.params.id,req.body.post);
        req.flash('success','Post Updated!');
        res.redirect('/posts/'+post.id);
    },
    async postDestroy (req,res,next) {
        await Post.findByIdAndRemove(req.params.id);
        req.flash('success','Post Deleted!');
        res.redirect('/posts/');
    }
}