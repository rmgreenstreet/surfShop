const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:String,
    image: {
        url: String,
        publicId: String
    },
    posts:[
        {type:Schema.Types.ObjectId,
        ref:'Post'}
    ],
    reviews:[
        {type:Schema.Types.ObjectId,
        ref:'Review'}],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);

