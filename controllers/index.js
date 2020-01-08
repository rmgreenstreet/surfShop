const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const passport = require('passport');

//configure where/how files are stored in cloudinary
let storage = multer.diskStorage({
    filename: function(req,file,callback) {
        callback(null,Date.now() + file.originalname);
    },
    folder:'surf_shop/users'
});

//only accept image files for cloudinary
let imageFilter = function (req,file,cb) {
    //accept image files only
    if (!file.originalname.match(/\.jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    else {
        cb(null,true);
    }
};

//configure multer as upload parameters for cloudinary
let upload = multer({storage:storage, filefilter:imageFilter});

//configure cloudinary upload settings
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
    // POST to 'Register' page to create new user
    async postRegister (req,res,next) {
        console.log('registering user');
        //send uploaded image to cloudinary
            await cloudinary.uploader.upload(req.file.path);
            //set adminStatus to false to initialize
            let adminStatus = false;
                if(req.body.adminCode === process.env.ADMINCODE) {
                    //if adminCode provided matches secret, set user's adminStatus to true, giving extra permissions
                    adminStatus = true;
                }
                //create a new User object with properties submitted
            const newUser = new User({
                username:req.body.username,
                email:req.body.email,
                //set User's image url and publicId to those returned from Cloudinary
                'image.url':result.url,
                'image.publicId':result.public_id,
                isAdmin:adminStatus});
                // register new User using these properties
            await User.register(newUser,req.body.password);
            passport.authenticate('local')(req,res,()=> {
                if(adminStatus === true) {
                    //if new User is an admin, send this message
                    req.flash('success','Admin Account Created! Welcome to the team, '+req.body.username)
                }
                else {
                    //if new User is not admin, send this message
                    req.flash('success','Account created! Welcome to the club, '+req.body.username+'!');
                }
                //redirect to the user's profile after logging in
                res.redirect('/profile/'+user._id);
            });
    },
    //POST to Login page
    async postLogin (req,res,next) {
        //use passport to authenticate user
        await passport.authenticate('local',{ 
            successRedirect: '/',
            failureRedirect: '/login' 
          })(req,res,next); //pass these parameters into the passport.authenticate method
    },
    //GET to Logout route
    async getLogout (req,res,next) {
        //use passport to log current user out
        await req.logout();
        //redirect to home page once logged out
        res.redirect('/');
    }
};