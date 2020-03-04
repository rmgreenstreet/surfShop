const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');
const mbxGeocoding = require ('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({accessToken:process.env.MAPBOX_TOKEN});
const moment = require('moment');

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
  location: String,
  geometry: {
    type: {
      type:String,
      enum:['Point'],
      required:false
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  properties: {
    description:String
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
  },
  slug:String,
  date:{
    type:Date,
    default:Date.now()
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

//calculates average rating based on ratings submitted on this post by users
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

//uses mapbox to forward geocode coordinates/place name
postSchema.methods.getCoordinates = async function(location) {
  try {
    let response = await geocodingClient.forwardGeocode({
        query:location,
        limit:1
    })
    .send();
    this.geometry = response.body.features[0].geometry;
    this.location = response.body.features[0].place_name;
    console.log(this.geometry);
    await this.save();
  }
  catch(err) {
    console.log(err);
  }
  return  
}

//generate url slug using post title and date created
async function slugWithDate(text) {
  let myText = text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
    
    //
    let date = moment(this.date)
      , formatted = date.format('YYYY[-]MM[-]DD[-]');

      return formatted + myText;

}

postSchema.pre('save', async function (next) {
  this.slug = await slugWithDate(this.title);
  next();
});

postSchema.plugin(mongoosePaginate);
postSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Post',postSchema);