const express = require('express');
const router = express.Router({mergeParams:true});

/* GET reviews index page /post/:id/reviews */
router.get('/', (req, res, next) => {
    res.send('/post/:id/reviews');
//   res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* GET create index page /post/:id/new */
router.get('/new', (req, res, next) => {
    res.send('/post/:id/reviews/new');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* GET reviews edit page  */
router.get('/:review_id/edit', (req, res, next) => {
    res.send('EDIT /post/:id/reviews/review_id/edit');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* PUT reviews update page  */
router.put('/:review_id', (req, res, next) => {
    res.send('UPDATE /post/:id/reviews/:review_id');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST delete review  */
router.post('/:review_id/', (req, res, next) => {
    res.send('DELETE /post/:id/reviews/:review_id');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

module.exports = router;
