const express = require('express');
const router = express.Router();
const { 
  getRegister,
  getLogin,
  postRegister, 
  postLogin, 
  getLogout, 
  landingPage,
  getProfile,
  updateProfile 
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
router.post('/register', asyncErrorHandler(postRegister));

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
asyncErrorHandler(isValidPassword),
asyncErrorHandler(changePassword), 
asyncErrorHandler(updateProfile), 
asyncErrorHandler(getProfile)
);

/* GET forgot password page  */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
});

/* PUT forgot password page  */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot');
});

/* GET reset password page  */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
});

/* PUT reset password page  */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
});

module.exports = router;
