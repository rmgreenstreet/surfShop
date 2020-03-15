
if (app.get('env') == 'development'){ require('dotenv').config(); }
const express = require('express');
const router = express.Router({mergeParams:true});
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
const { 
    asyncErrorHandler, 
    isLoggedIn, 
    isPostAuthor, 
    searchAndFilterPosts 
} = require('../middleware');
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
router.get('/', 
asyncErrorHandler(searchAndFilterPosts), 
asyncErrorHandler(postIndex)
);

/* GET create post page  */
router.get('/new', 
isLoggedIn, 
postNew
);

/* POST new post  */
router.post('/', 
isLoggedIn, 
upload.array('image', 4),
asyncErrorHandler(postCreate)
);

/* GET show page  */
router.get('/:slug', 
asyncErrorHandler(postShow)
);

/* GET posts edit page  */
router.get('/:id/edit',
isLoggedIn, 
isPostAuthor, 
postEdit
);

/* PUT posts update  */
router.put('/:id', 
isLoggedIn, 
isPostAuthor, 
upload.array('image', 4), 
asyncErrorHandler(postUpdate)
);

/* POST delete post  */
router.delete('/:id/', 
isLoggedIn, 
isPostAuthor, 
asyncErrorHandler(postDestroy)
);

module.exports = router;
