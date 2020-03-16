const Cart = require('../models/cart');
// const Post = require('../models/post');

it('should create a cart witn no items and log empty array', async () => {
    let cart = await Cart.create({items:[]});
    cart.getTotal();
});