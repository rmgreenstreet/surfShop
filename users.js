const express = require('express');
const router = express.Router({mergeParams:true});

/* GET show user profile  */
router.get('/:user_id', (req, res, next) => {
    res.send('SHOW profile/:user_id');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* PUT user update page  */
router.put('/:user_id', (req, res, next) => {
    res.send('UPDATE profile/:user_id');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

/* POST delete user  */
router.post('/:user_id/', (req, res, next) => {
    res.send('DELETE profile/:user_id/');
    // res.render('index', { title: 'SurfShop - Home', page:'home' });
});

module.exports = router;
