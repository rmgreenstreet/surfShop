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
    ]
});

module.exports = mongoose.model('Cart',cartSchema);