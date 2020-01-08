const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:String,
    price:Number,
    description:String,
    images: [
      {
        url: String,
        publicId: String
      }
  ],
    author:
      {
        type:Schema.Types.ObjectId,
        ref:'User'
      },
    reviews:[
        {
          type:Schema.Types.ObjectId,
          ref:'Review'
        }
      ],
      averageReview:Number
});

module.exports = mongoose.model('Post',postSchema);
