const express = require('express');
const router = express.Router({mergeParams:true});
const multer=require('multer');
const { asyncErrorHandler } = require('../middleware');
const { 
    postIndex, 
    postNew, 
    postCreate,
    postShow,
    postEdit,
    postUpdate,
    postDestroy
} = require('../controllers/posts');

//configure where/how files are stored in cloudinary
let storage = multer.diskStorage({
    filename: function(req,file,callback) {
        callback(null,Date.now() + file.originalname);
    }
});

//only accept image files for cloudinary
let imageFilter = (req,file,cb) => {
    //accept image files only
    if (!file.originalname.match(/\.jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    else {
        cb(null,true);
    }
};

//configure multer as upload parameters for cloudinary
let upload = multer({storage:storage, filefilter:imageFilter}).array('image',10);

/* GET posts index page /posts */
router.get('/',asyncErrorHandler(postIndex));

/* GET create post page  */
router.get('/new', postNew);

/* POST new post  */
router.post('/', upload ,asyncErrorHandler(postCreate));

/* GET show page  */
router.get('/:id', asyncErrorHandler(postShow));

/* GET posts edit page  */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* PUT posts update  */
router.put('/:id', asyncErrorHandler(postUpdate));

/* POST delete post  */
router.post('/:id/', asyncErrorHandler(postDestroy));

module.exports = router;
