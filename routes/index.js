const express = require('express');
const router = express.Router();
const { postRegister, postLogin, getLogout, landingPage } = require('../controllers');
const { asyncErrorHandler } = require('../middleware');
const multer = require('multer');
//configure where/how files are stored in cloudinary
const storage = multer.diskStorage({
    filename: function(req,file,callback) {
        callback(null,Date.now() + file.originalname);
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

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET create user page  */
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'SurfShop - Register', page:'Register' });
});

/* POST create user page  */
router.post('/register', upload.single('image'),asyncErrorHandler(postRegister));

/* GET login page  */
router.get('/login', (req, res, next) => {
  res.send('GET /login');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST LOGIN page  */
router.post('/login', asyncErrorHandler(postLogin));
  

/* GET logout  */
router.get('/logout', asyncErrorHandler(getLogout));

/* GET forgot password page  */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
  // res.render('forgot', { title: 'SurfShop - Forgot Password', page:'forgot' });
});

/* PUT forgot password page  */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* GET reset password page  */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* PUT reset password page  */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

module.exports = router;
