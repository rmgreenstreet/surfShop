const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    parent:{
        type:Schema.Types.ObjectId,
        ref:'Post'
    },
    title:String,
    body:String,
    rating:{
        type:Number,
        required:false
    },
    author:
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
});

module.exports = mongoose.model('Review',UserSchema);
