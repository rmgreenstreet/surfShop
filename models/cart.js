const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');

const cartSchema = new Schema({
    items:[
        {
            id:Schema.types.objectId,
            ref:'Post',
            quantity:Number
        }
    ],
    async incrementItem(itemId,newQuantity) {
        let itemToIncrement = this.items.find(item => item.id === itemId);
        if (newQuantity <= 1){
            await this.removeItem(itemId);
        } else {
            itemToIncrement.quantity = newQuantity;
            await this.save();
        }
    },
    async removeItem(itemId) {
        const indexToRemove = this.items.indexOf(item => item.id === itemId);
        this.items.splice(indexToRemove,1);
        this.save();
    }
});

module.exports = mongoose.model('Cart',cartSchema);