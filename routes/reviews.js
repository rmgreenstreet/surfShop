const express = require('express');
const router = express.Router({mergeParams:true});
const { asyncErrorHandler,
        isReviewAuthor 
    } =require('../middleware');
const {
    reviewCreate,
    reviewUpdate,
    reviewDestroy
} = require('../controllers/reviews.js');

/* GET create index page /post/:id/new */
router.post('/', asyncErrorHandler(reviewCreate));

/* PUT reviews update page  */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* POST delete review  */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));

module.exports = router;
