const express = require('express');
const router = express.Router();

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
router.post('/register', (req, res, next) => {
  res.send('POST /register');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* GET login page  */
router.get('/login', (req, res, next) => {
  res.send('GET /login');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST LOGIN page  */
router.post('/login', (req, res, next) => {
  res.send('POST /login');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST logout page  */
router.post('/logout', (req, res, next) => {
  res.send('POST /logout');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
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

/* GET forgot password page  */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* PUT forgot password page  */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
  // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

module.exports = router;
