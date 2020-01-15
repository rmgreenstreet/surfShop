const Post = require('../models/post');
const Review = require('../models/review');

async function calculateAverageRating(post) {
    console.log('calculating averate rating')
    console.log('post\'s current average rating is: '+post.averageRating);
    let reviewTotal = 0;
    for (const review of post.reviews) {
        let foundReview = await Review.findById(review);
        console.log('current review\'s rating is: '+foundReview.rating);
        // let foundReview = await Review.findById(review);
        reviewTotal += foundReview.rating;
    }
    //apply average rating to the post
    console.log('review total is: '+reviewTotal);
    post.averageRating = (reviewTotal/post.reviews.length);
    console.log('post\'s new average rating is: '+post.averageRating);
    return post;
}

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
        await post.reviews.push(review._id);
        console.log(post.reviews);
        //calculate the average rating of the post
        try {
            await calculateAverageRating(post);
        }
        catch(err) {
            await review.remove();
            req.session.error='Average Rating Could Not Be Calculated';
            return res.redirect('/posts/'+post.id);
        }
        //save the post with the new review
        await post.save();
        req.session.success="Review Created!";
		res.redirect('/posts/'+post.id);
	},
    // Review Update
	async reviewUpdate(req, res, next) {
        //find review in DB
        await Review.findByIdAndUpdate(req.params.review_id,req.body.review);
        let post = await Post.findById(req.params.id).populate({
            path:'reviews',
            model:'Review'
        });
        await calculateAverageRating(post);
        // redirect to show page
        req.session.success='Review Updated!';
		res.redirect(`/posts/${req.params.id}`);
    },
    //Reviews Destory
    async reviewDestroy (req,res,next) {
        
        req.session.success='Review Deleted!';
        req.flash('success','Review Deleted!');
        res.redirect('/posts/');
    }
}