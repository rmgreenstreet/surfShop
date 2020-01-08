const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const passport = require('passport');
// const async = require('async');

let storage = multer.diskStorage({
    filename: function(req,file,callback) {
        callback(null,Date.now() + file.originalname);
    },
    folder:'surf_shop/users'
});

let imageFilter = function (req,file,cb) {
    //accept image files only
    if (!file.originalname.match(/\.jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    else {
        cb(null,true);
    }
};

let upload = multer({storage:storage, filefilter:imageFilter});

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
    async postRegister (req,res,next) {
        console.log('registering user');
            await cloudinary.uploader.upload(req.file.path);
            let adminStatus = false;
                if(req.body.adminCode === process.env.ADMINCODE) {
                    adminStatus = true;
                }
            const newUser = new User({
                username:req.body.username,
                email:req.body.email,
                'image.url':result.url,
                'image.publicId':result.public_id,
                isAdmin:adminStatus});
            await User.register(newUser,req.body.password);
            passport.authenticate('local')(req,res,()=> {
                if(adminStatus === true) {
                    req.flash('success','Admin Account Created! Welcome to the team, '+req.body.username)
                }
                else {
                    req.flash('success','Account created! Welcome to the club, '+req.body.username+'!');
                }
                res.redirect('/profile/'+user._id);
            });
    },

    async postLogin (req,res,next) {
        await passport.authenticate('local',{ 
            successRedirect: '/',
            failureRedirect: '/login' 
          })(req,res,next);
    },
    async getLogout (req,res,next) {
        await req.logout();
            res.redirect('/');
    }
};