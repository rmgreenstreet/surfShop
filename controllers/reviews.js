const Post = require('../models/post');
const Review = require('../models/review');


module.exports = {
    //create new review
    async reviewCreate(req, res, next) {
        //find the post
        let post = await Post.findById(req.params.id);
        //create the review
        let review = await Review.create(req.body.review);
        //assign the current user as the author of the review
        review.author=req.user._id;
        //save new review
        review.save();
        //push the review into the post
        await post.reviews.push(review);
        //calculate the average rating of the post
        let reviewTotal = 0;
        for (const review of post.reviews) {
            reviewTotal += review.rating;
        }
        //apply average rating to the post
        post.averageRating = (reviewTotal/post.reviews.length);
        //save the post with the new review
        post.save();
        req.session.success="Review Created!";
		res.redirect('/posts/'+post.id);
	},
    // Review Update
	async reviewUpdate(req, res, next) {
		
        // redirect to show page
        req.session.success='Review Updated!';
        req.flash('success','Review Updated!');
		res.redirect(`/posts/${post.id}`);
    },
    //Reviews Destory
    async reviewDestroy (req,res,next) {
        
        req.session.success='Review Deleted!';
        req.flash('success','Review Deleted!');
        res.redirect('/posts/');
    }
}