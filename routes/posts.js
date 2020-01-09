require('dotenv').config({ path: '.env' });
const express = require('express');
const router = express.Router({mergeParams:true});
const multer = require('multer');
//configure where/how files are stored in cloudinary
const storage = multer.diskStorage({
    filename: function(req,file,callback) {
        callback(null,Date.now() + file.originalname);
    },
    destination: function (req, file, cb) {
        cb(null, 'uploads')
      }
});
//only accept image files for cloudinary
const imageFilter = (req,file,cb) => {
    if (!file.originalname.match(/\.jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    else {
        cb(null,true);
    }
};
//configure multer as upload parameters for cloudinary
const upload = multer({storage:storage, filefilter:imageFilter});
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


/* GET posts index page /posts */
router.get('/',asyncErrorHandler(postIndex));

/* GET create post page  */
router.get('/new', postNew);

/* POST new post  */
router.post('/', upload.array('image', 4) ,asyncErrorHandler(postCreate));

/* GET show page  */
router.get('/:id', asyncErrorHandler(postShow));

/* GET posts edit page  */
router.get('/:id/edit' , asyncErrorHandler(postEdit));

/* PUT posts update  */
router.put('/:id', upload.array('image', 4), asyncErrorHandler(postUpdate));

/* POST delete post  */
router.delete('/:id/', asyncErrorHandler(postDestroy));

module.exports = router;
