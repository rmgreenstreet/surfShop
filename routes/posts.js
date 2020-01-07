const express = require('express');
const router = express.Router({mergeParams:true});

/* GET posts index page /posts */
router.get('/', (req, res, next) => {
    res.send('/posts');
//   res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* GET create index page  */
router.get('/new', (req, res, next) => {
    res.send('/new');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST new post  */
router.post('/', (req, res, next) => {
    res.send('CREATE /posts');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

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
