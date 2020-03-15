const express = require('express');
const router = express.Router();

router.get('/cart', );

router.post('/cart', async (req,res) => {
    try {
        const product = productsRepo.getOne(req.body.productId);
        //figure out the cart (do we need to make one, or get one out of the repo)
        let cart;
        if(!req.session.cartId) {
            try {
                //we don't have a cart, we need to create one and store cart id in session
                cart = await cartsRepo.create({items:[]});
                req.session.cartId = cart.id;
            } catch (err) {
                console.log('could not create cart');
                console.log(err);
                return res.redirect('/');
            }
            
        } else {
            try {
                //we have a cart, let's get it from the repo
                cart = await cartsRepo.getOne(req.session.cartId);
            } catch(err) {
                console.log('could not find cart');
                console.log(err);
                return res.redirect('/');
            }
            
        }

        /*either increment quantity for existing product, or 
        add new product to the items array */
        const existingItem = cart.items.find(item => item.id === req.body.productId);
        if(existingItem) {
            //increment quantity and save cart
            existingItem.quantity ++;
        } else {
            //add new product id to items array
            cart.items.push({id:req.body.productId, quantity:1});
        }
        await cartsRepo.update(cart.id, {items: cart.items});
        res.redirect('/cart');
    } catch(err) {
        console.log(err);
        res.redirect('/')
    }
    
});

router.put('/cart', (req,res) => {

})

router.delete('/cart', async (req,res) => {
    try {
        const { itemId } = req.body;
        const cart = await cartsRepo.getOne(req.session.cartId);
        const items = await cart.items.filter(item => item.id !== itemId );
        await cartsRepo.update(req.session.cartId,{items});
        console.log('item removed');
        res.redirect('/cart');
    } catch(err) {
        console.log(err);
        return res.redirect('back');
    }
});

module.exports = router;