const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const faker = require('faker');

const couponSchema = new Schema ({
    word:{
        type:String,
        unique:true,
        default:faker.random.word().toUpperCase()
    },
    amount:{
        type:Number,
        default:Math.floor(Math.random() * 26)
    },
    expires: {
        type:Date,
        default:Date.now() + (1000 * 60 * 60 * 72)
    },
    isActive: {
        type:Boolean,
        require:true,
        default:true
    }
});

module.exports = mongoose.model('Coupon',couponSchema);