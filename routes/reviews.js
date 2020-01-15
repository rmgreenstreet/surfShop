const express = require('express');
const router = express.Router({mergeParams:true});
const { asyncErrorHandler } =require('../middleware');
const {
    reviewCreate,
    reviewUpdate,
    reviewDestroy
} = require('../controllers/reviews.js');

/* GET create index page /post/:id/new */
router.post('/', asyncErrorHandler(reviewCreate));

/* PUT reviews update page  */
router.put('/:review_id', asyncErrorHandler(reviewUpdate));

/* POST delete review  */
router.post('/:review_id/', asyncErrorHandler(reviewDestroy));

module.exports = router;
