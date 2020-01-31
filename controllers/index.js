const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const ColorThief = require('color-thief');
let colorThief = new ColorThief();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function loginAfterChange (user,req,res) {
    console.log('logging back in after a change to account');
    const login = util.promisify(req.login.bind(req));
    await login(user);
};



module.exports = {
	// GET /
	async landingPage(req, res, next) {
        const posts = await Post.find({}).sort('-_id').exec();
        const recentPosts = posts.slice(0,3);
        const randomIndex = await Math.ceil(Math.random()*posts.length);
        const dominantColor = await colorThief.getColor(`public/${posts[randomIndex].images[0].url}`);
        const color = `rgb(${dominantColor[0]},${dominantColor[1]},${dominantColor[2]})`
		res.render('index', { posts, mapBoxToken, randomIndex, color, recentPosts, title: 'Surf Shop - Home', page:'home'});
	},
	// GET /register
	getRegister(req, res, next) {
		res.render('register', { title: 'Surf Shop - Register', page:'register', username:'', email:''});
	},
	// POST /register
	async postRegister(req, res, next) {
        try {
            if(req.file) {
                const { secure_url, public_id } = req.file;
                req.body.image = {secure_url, public_id};
            }
            const user = await User.register(new User(req.body), req.body.password);
            req.login(user, function(err) {
                if (err) return next(err);
                req.session.success = `Welcome to Surf Shop, ${user.username}!`;
                res.redirect('/');
            });
        }
        catch (err) {
            deleteProfileImage(req);
            const { username, email } = req.body;
            let error = err.message;
            if (error.includes('E11000') && error.includes('email')) {
                error = 'A user with the given email is already registered';
            }
            res.render('register', { title: 'Surf Shop - Register', page:'register', username, email, error })
        }
	},
	// GET /login
	getLogin(req, res, next) {
        if(req.isAuthenticated()) {
            req.session.error = 'You are already logged in'
            return res.redirect('/');
        }
        if(req.query.returnTo) {
            req.session.redirectTo = req.headers.referer;
        }
		res.render('login', { title: 'Login' , page:'login'});
	},
	// POST /login
	async postLogin(req, res, next) {
        const {username, password } = req.body;
        const { user, error } = await User.authenticate()(username, password);
        if(!user && error) {
            return next(error);
        }
        req.login(user, function (err) {
            if(err){
                return next(err);
            }
            req.session.success = `Welcome back, ${username}`;
            const redirectUrl = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        });
	},
	// GET /logout
	getLogout(req, res, next) {
	  req.logout();
	  res.redirect('/');
    },
    async getProfile(req,res,next) {
        const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
        res.render('profile', {posts, title: `Surf Shop - ${req.user.username}'s Profile`, page: 'profile'})
    },
     async updateProfile(req,res,next) {
        const { username, email } = req.body
        let { user } = res.locals;
        if(username) {
            user.username = username;
        }
        if(email) {
            user.email = email;
        }
        if(req.file) {
            if (user.image.public_id) {
                await cloudinary.uploader.destroy(user.image.public_id);
                const { secure_url, public_id} = req.file;
                user.image = { secure_url, public_id };        
            }
        }
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);
        req.session.success="Profile has been updated!";
        res.redirect('/profile');
     },
     getForgotPw(req,res,next) {
        res.render('users/forgot');
     },
     async putForgotPw(req,res,next) {
         console.log('request received to reset password');
        const token = await crypto.randomBytes(20).toString('hex');
        console.log('finding user with the submitted email address');
        const user = await User.findOne({email:req.body.email});
        if(!user) {
            console.log('no user with this email found');
            req.session.error = 'No account with this email address found: '+req.body.email;
            return res.redirect('/forgot-password');
        }
        else { 
            console.log('user with this email found. updating reset token');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;
            await user.save();
            console.log('reset token updated. sending reset email');
            const msg = {
                from:{
                    email:'rgreenstreetdev@gmail.com',
                    name:'SurfShop Admin'
                },
                to:[{email:user.email}],
                subject:'Your SurfShop Password Reset Request',
                content:[{
                    type:'text/plain',
                    value:`You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    Please click on the following link, or copy and paste it into your browser to complete the process:
                    http://${req.headers.host}/reset/${token}
                    If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/                /g, '')
                }]
            };
            sgMail
            .send(msg)
            .then(() => {
                //Celebrate
                console.log('reset email sent')
                req.session.success = `An email has been sent to ${user.email} with further instructions!`;
                res.redirect('/');
            })
            .catch(error => {

                //Log friendly error
                console.error(error.toString());

                //Extract error msg
                const {message, code, response} = error;

                //Extract response msg
                const {headers, body} = response;
            });
        }
     },
     async getReset(req,res,next) {
         const {token} = req.params;
         console.log('token is '+token);
         const user = await User.findOne({
             resetPasswordToken:token,
             resetPasswordExpires: { $gt: Date.now() }
         });
         if(!user) {
             req.session.error = "The password reset token is invalid or expired. Please try again.";
             return res.redirect('/forgot-password');
         }
         else {
            res.render('users/reset',{token});
         }
     },
     async putReset(req,res,next) {
        const {token} = req.params;
        console.log('reset token is '+token);
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        console.log(user);
        if(!user) {
            req.session.error = "The password reset token is invalid or expired. Please try again.";
            return res.redirect('/forgot-password');
        }
        
        if(req.body.password === req.body.confirm) {
           await user.setPassword(req.body.password);
           user.resetPasswordToken = null;
           user.resetPasswordExpires = null;
           await user.save();
           await loginAfterChange(user,req,res);
        } else {
            req.session.error = 'Passwords do not match!';
            return res.redirect(`/reset/${token}`);
        }
        const msg = {
            from:{
                email:'rgreenstreetdev@gmail.com',
                name:'SurfShop Admin'
            },
            to:[{email:user.email}],
            subject:'Your SurfShop Password Has Been Reset',
            content:[{
                type:'text/plain',
                value:`Hello,
                This email is to confirm that the password for your account has just been changed.
                If you did not make this change, please hit reply and notify us at once.`.replace(/            /g, '')
            }]
        };
        await sgMail.send(msg);
        req.session.success = 'Your password has been successfully changed!';
        res.redirect('/profile');
     }
}