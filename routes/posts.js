const express = require('express');
const router = express.Router({mergeParams:true});
const multer=require('multer');
const { errorHandler } = require('../middleware');
const { 
    getPosts, 
    newPost, 
    createPost 
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
router.get('/',errorHandler(getPosts));

/* GET create post page  */
router.get('/new', errorHandler(newPost));

/* POST new post  */
router.post('/', upload ,errorHandler(createPost));

/* GET show page  */
router.get('/:id', (req, res, next) => {
    res.send('SHOW /:id');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* GET posts edit page  */
router.get('/:id/edit', (req, res, next) => {
    res.send('EDIT /:id/edit');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* PUT posts update page  */
router.put('/:id', (req, res, next) => {
    res.send('UPDATE /:id');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST delete post  */
router.post('/:id/', (req, res, next) => {
    res.send('DELETE /:id/');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

module.exports = router;
