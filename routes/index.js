const express = require('express');
const router = express.Router();
const { postRegister } = require('../controllers');
const { errorHandler } = require('../middleware');
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* GET create user page  */
router.get('/register', (req, res, next) => {
  res.send('GET /register');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST create user page  */
router.post('/register',errorHandler(postRegister));

/* GET login page  */
router.get('/login', (req, res, next) => {
  res.send('GET /login');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST LOGIN page  */
router.post('/login', passport.authenticate('local',{ 
  successRedirect: '/',
  failureRedirect: '/login' 
}));
  

/* GET logout page  */
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

/* GET forgot password page  */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
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
