const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    items:[
        {
            post:{
                type:Schema.Types.ObjectId,
                ref:'Post'
            },
            quantity:Number
        }
    ]
});

cartSchema.methods.incrementItem = async function(itemId,newQuantity) {
    let itemToIncrement = this.items.find(item => item.post.equals(itemId));
    if (newQuantity <= 1){
        await this.removeItem(itemId);
    } else {
        itemToIncrement.quantity = newQuantity;
        await this.save();
    }
};
cartSchema.methods.removeItem = async function(itemId) {
    const indexToRemove = this.items.indexOf(item => item.post === itemId);
    this.items.splice(indexToRemove,1);
    this.save();
};
cartSchema.methods.getTotal = async function() {
    return this.items.reduce((total,current) => {
        return total + (current.post.price * current.quantity);
    },0);
};

module.exports = mongoose.model('Cart',cartSchema);