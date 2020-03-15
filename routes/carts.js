const express = require('express');
const router = express.Router();
const { asyncErrorHandler} = require('../middleware');
const { 
    getCart,
    postCart,
    putCart,
    deleteItemFromCart,
    postCheckout
 } = require('../controllers/carts');

router.get('/', asyncErrorHandler(getCart));

router.post('/', asyncErrorHandler(postCart));

router.put('/', asyncErrorHandler(putCart));

router.delete('/', asyncErrorHandler(deleteItemFromCart));

router.post('/checkout', asyncErrorHandler(postCheckout));

module.exports = router;