const User = require('../models/user');
const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;
const passport = require('passport');
const fs = require('fs');

//configure cloudinary upload settings
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function imageUpload(file,documentType) {
    uploadedImage={};
    let image = await cloudinary.uploader.upload(file, {folder:'surf_shop/dev/'+documentType});
    uploadedImage.url=image.secure_url;
    uploadedImage.public_id=image.public_id;
    await fs.unlink(file,(err)=>{});
    return uploadedImage;
}

module.exports = {
    //GET / 
    async landingPage(req,res,next) {
        const posts = await Post.find({});
        res.render('index',{posts,mapBoxToken:process.env.MAPBOX_TOKEN, title: 'SurfShop - Home', page:'home' });
    },
    // POST to 'Register' page to create new user
    async postRegister (req,res,next) {
        console.log('registering user');
        //if there is an image uploaded, send uploaded image to cloudinary
        let result;
        if(req.file) {
             result = await imageUpload(req.file.path);
        }
        //set adminStatus to false to initialize
        let adminStatus = false;
        if(req.body.adminCode && req.body.admincode === process.env.ADMINCODE) {
            //if adminCode provided matches secret, set user's adminStatus to true, giving extra permissions
            adminStatus = true;
        }
        else {
            adminStatus=false;
        }
            //create a new User object with properties submitted
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            isAdmin: adminStatus
        });
        if(req.file) {
            //set User's image url and public_id to those returned from Cloudinary
            newUser.image.url= result.secure_url;
            newUser.image.public_id= result.public_id;
        }
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
            res.redirect('/');
            //redirect to the user's profile after logging in
            // res.redirect('/profile/'+user._id);
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