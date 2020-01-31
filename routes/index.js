const express = require('express');
const router = express.Router({mergeParams:true});
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});
const { 
  getRegister,
  getLogin,
  postRegister, 
  postLogin, 
  getLogout, 
  landingPage,
  getProfile,
  updateProfile,
  getForgotPw,
  putForgotPw,
  getReset,
  putReset
} = require('../controllers');
const { 
  asyncErrorHandler, 
  isLoggedIn,
  isValidPassword,
  changePassword
} = require('../middleware');

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET create user page  */
router.get('/register', getRegister);

/* POST create user page  */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));

/* GET login page  */
router.get('/login', getLogin);

/* POST LOGIN page  */
router.post('/login', asyncErrorHandler(postLogin));

/* GET logout  */
router.get('/logout', asyncErrorHandler(getLogout));

/*GET profile page */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/*PUT profile page */
router.put('/profile', 
isLoggedIn, 
upload.single('image'), 
asyncErrorHandler(isValidPassword),
asyncErrorHandler(changePassword), 
asyncErrorHandler(updateProfile), 
asyncErrorHandler(getProfile)
);

/* GET forgot password page  */
router.get('/forgot-password', getForgotPw);

/* PUT forgot password page  */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET reset password page  */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT reset password page  */
router.put('/reset/:token', asyncErrorHandler(putReset));

module.exports = router;
