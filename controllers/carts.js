const Cart = require('../models/cart');
const Post = require('../models/post');


module.exports = {
    async getCart(req,res,next) {
        let cart;
        if(!req.session.cartId) {
            req.session.error = 'There are no items currently in your cart';
            return res.redirect('/');
        }
    
        try {
            cart = await Cart.findById(req.session.cartId);
        } catch(err) {
            req.session.error = 'cart could not be found';
            console.log(err);
            return res.redirect('/')
        }
    
        try {
            for (let item of cart.items) {
                const post = await Post.findById(item.id);
                item.post = post;
            };
        } catch (err) {
            req.session.error = 'error finding items';
            console.log(err);
            return res.redirect('/');
        }
        res.render('users/cart',{items:cart.items});
    },

};