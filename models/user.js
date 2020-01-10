const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:String,
    image: {
        url: {
            type:String,
            default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        public_id: String
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);

