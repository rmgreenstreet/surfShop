const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

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
  location: {
    formattedAddress:String,
    lat:Number,
    lng:Number
  },
  author:
    {
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
  averageRating:{
    type:Number,
    default:0
  }
});
//removes all reviews associated with the particular post when 'remove' is called. only works if you have found the particular post first, not using Post.findByIdAndRemove
postSchema.pre('remove', async function () {
  console.log('removing reviews');
  await Review.remove({
    _id: {
      $in: this.reviews
    }
  });
});

postSchema.methods.calculateAverageRating = function() {
  console.log('calculating averate rating')
  console.log('post\'s current average rating is: '+this.averageRating);
  let reviewTotal = 0;
  if(this.reviews && this.reviews.length) {
    this.reviews.forEach(review => {
      reviewTotal += review.rating;
    });
    this.averageRating = Math.round((reviewTotal/this.reviews.length)*4)/4;
    //apply average rating to the post
    console.log('review total is: '+reviewTotal);
    this.averageRating = (reviewTotal/this.reviews.length);
  }
  else {
      this.averageRating = reviewTotal;
  }
  
  console.log('post\'s new average rating is: '+post.averageRating);
  this.save();
  const floorRating = Math.floor(this.averageRating);
  return floorRating;
}

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post',postSchema);
