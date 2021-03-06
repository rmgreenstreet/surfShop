const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
    //create new review
    async reviewCreate(req, res, next) {
        //find the post and all of its reviews
        let post = await Post.findById(req.params.id).populate('reviews').exec();
        /* see if this user has reviewed this post before, and if so, 
        don't allow them to review again */
        let hasReviewed = await post.reviews.filter(review => {
            return review.author.equals(req.user._id);
        }).length;
        if(hasReviewed) {
            req.session.error="Sorry, you can only review each post once";
            return res.redirect(`/posts/${post.id}`);
        }
        //create the review
        let review = await Review.create(req.body.review);
        //assign the current user as the author of the review
        review.author=req.user._id;
        //save new review
        review.save();
        //push the review into the post
        await post.reviews.push(review._id);
        //save the post with the new review
        post.calculateAverageRating();
        post.save();
        req.session.success="Review Created!";
		res.redirect('/posts/'+post.id);
	},
    // Review Update
	async reviewUpdate(req, res, next) {
        //find review in DB
        await Review.findByIdAndUpdate(req.params.review_id,req.body.review);
        //find post in order to update average rating
        let post = await Post.findById(req.params.id);
        //calculate new average rating and save post
        await calculateAverageRating(post);
        // redirect to show page
        req.session.success='Review Updated!';
		res.redirect(`/posts/${req.params.id}`);
    },
    //Reviews Destory
    async reviewDestroy (req,res,next) {
        console.log('deleting review');
        //remove the review reference from the post (saving at the same time)
        await Post.findByIdAndUpdate(req.params.id,{$pull: {reviews: req.params.review_id}});
        //get the updated post from the db
        let post = await Post.findById(req.params.id);
        //get and save the new rating wihout the removed review
        calculateAverageRating(post);
        //remove the review itself from the db
        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success='Review Deleted!';
        res.redirect(`/posts/${req.params.id}`);
    }
}