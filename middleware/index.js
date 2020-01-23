const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
		},
	isReviewAuthor: async (req,res,next) => {
		let review = await Review.findById(req.params.review_id);
		if (review.author.equals(req.user._id)) {
			return next();
		}
		req.session.error = "This review does not belong to you."
		return res.redirect(`/posts/${req.params.id}`);
	},
	isLoggedIn: (req,res,next) => {
		if(req.isAuthenticated()) return next();
		req.session.error = 'You need to be logged in to do that!';
		req.session.redirectTo = req.originalUrl;
		res.redirect('/login');
	},
	isPostAuthor: async (req,res,next) => {
		const post = await Post.findById(req.params.id);
		if(post.author.equals(req.user._id)){
			res.locals.post=post;
			return next();
		}
		req.session.error='Access Denied!'
		res.redirect('back')
	},
	isValidPassword: async (req,res,next) => {
		const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
		if(user){
			console.log('found user');
			//add user to res.locals
			res.locals.user = user
			next();
		}
		else {
			console.log('no user found');
			req.session.error = "Incorrect current password!";
			return res.redirect('/profile');
		}
	},
	changePassword: async (req,res,next) => {
		const {
			newPassword,
			passwordConfirmation,
		} = req.body;
		if(newPassword && passwordConfirmation) {
			console.log('user wants to change password')
			const { user } = res.locals;
			if(newPassword === passwordConfirmation) {
				console.log('passwords match');
				await user.setPassword(newPassword);
				next();
			} else {
				console.log('passwords do not match');
				req.session.error = "New passwords do not match!"
				return res.redirect('/profile');
			}
		} else {
			next();
		}
	}
}
