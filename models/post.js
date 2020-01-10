const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title:String,
  price:Number,
  description:String,
  images: [
    {
      url: {
        type:String,
        default:'https://res.cloudinary.com/rgreenstreet/image/upload/v1578603203/surf_shop/post/149933_txhwtj.png'
      },
      public_id: String,
    }
  ],
  location:String,
  lat:Number,
  lng:Number,
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
