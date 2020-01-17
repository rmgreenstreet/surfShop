const Post = require('../models/post');
const Review = require('../models/review');

async function calculateAverageRating(post) {
    console.log('calculating averate rating')
    console.log('post\'s current average rating is: '+post.averageRating);
    let reviewTotal = 0;
    if(post.reviews && post.reviews.length) {
        for (const review of post.reviews) {
            let foundReview = await Review.findById(review);
            console.log('current review\'s rating is: '+foundReview.rating);
            // let foundReview = await Review.findById(review);
            reviewTotal += foundReview.rating;
        }
        //apply average rating to the post
        console.log('review total is: '+reviewTotal);
        post.averageRating = (reviewTotal/post.reviews.length);
    }
    else {
        post.averageRating = reviewTotal;
    }
    
    console.log('post\'s new average rating is: '+post.averageRating);
    return await post.save();
}

module.exports = {
    //create new review
    async reviewCreate(req, res, next) {
        //find the post
        let post = await Post.findById(req.params.id).populate('reviews').exec();
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
        console.log(post.reviews);
        //calculate the average rating of the post and save the post with the new average and new review
        try {
            await calculateAverageRating(post);
        }
        catch(err) {
            await review.remove();
            req.session.error='Average Rating Could Not Be Calculated';
            return res.redirect('/posts/'+post.id);
        }
        //save the post with the new review
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
        await Post.findByIdAndUpdate(req.params.id,{$pull: {reviews: req.params.review_id}});
        let post = await Post.findById(req.params.id);
        calculateAverageRating(post);
        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success='Review Deleted!';
        res.redirect(`/posts/${req.params.id}`);
    }
}