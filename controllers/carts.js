const Cart = require('../models/cart');
const Post = require('../models/post');


module.exports = {
    async getCart(req,res,next) {
        let cart;
        let cartTotal = 0;
        if(!req.session.cartId) {
            req.session.error = 'There are no items currently in your cart';
            return res.redirect('/');
        }
        try {
            cart = await Cart.findById(req.session.cartId).populate({
                path:'items.post',
                model:Post
            }).exec();
            cartTotal = await cart.getTotal();
        } catch(err) {
            req.session.error = 'cart could not be found';
            console.log(err);
            return res.redirect('/')
        }
        res.render('users/cart',{items:cart.items, cartTotal, page:'cart'});
    },
    async postCart(req,res,next){
        try {
            //figure out the cart (do we need to make one, or get one out of the repo)
            let cart;
            if(!req.session.cartId) {
                try {
                    //we don't have a cart, we need to create one and store cart id in session
                    cart = await Cart.create({items:[]});
                    req.session.cartId = cart._id;
                } catch (err) {
                    req.session.error = 'could not create cart';
                    console.log(err);
                    return res.redirect('/');
                }
                
            } else {
                try {
                    //we have a cart, let's get it from the repo
                    cart = await Cart.findById(req.session.cartId);
                } catch(err) {
                    console.log('could not find cart');
                    console.log(err);
                    return res.redirect('/');
                }
                
            }
    
            /*either increment quantity for existing product, or 
            add new product to the items array */
            const existingItem = cart.items.find(item => item.post === req.body.productId);
            if(existingItem) {
                //increment quantity and save cart
                existingItem.quantity ++;
            } else {
                //add new product id to items array
                cart.items.push({post:req.body.productId, quantity:1});
            }
            await cart.save();
            res.redirect('/cart');
        } catch(err) {
            console.log(err);
            res.redirect('/')
        }
    },
    async putCart(req,res,next) {
        try {
            const { itemId, newQuantity } = req.body;
            let cart = await Cart.findById(req.session.cartId);
            await cart.incrementItem(itemId, newQuantity);
            res.redirect('/cart');
        } catch(err) {
            req.session.error = 'Unable to update quantity. Please try again';
            console.error(err);
            res.redirect('/cart');
        }
    },
    async deleteItemFromCart(req,res,next) {
        try {
            const { itemId } = req.body;
            const cart = await Cart.findById(req.session.cartId);
            await cart.removeItem(itemId);
            console.log('item removed');
            res.redirect('/cart');
        } catch(err) {
            console.log(err);
            return res.redirect('back');
        }
    }
};