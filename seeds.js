const faker = require('faker');
const Post = require('./models/post');
const NodeGeocoder = require('node-geocoder');


var mapsOptions = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODING_KEY,
    formatter: null
  };
   
  var geocoder = NodeGeocoder(mapsOptions);

  
async function getCoordinates(location) {
    locationObj = {};
    await geocoder.geocode(location, (err, data) => {
		locationObj.lat = data[0].latitude;
		locationObj.lng = data[0].longitude;
        locationObj.formattedAddress = data[0].formattedAddress;
    });
    return locationObj;
}

async function seedPosts() {
    await Post.remove({});
    let postsToCreate = [];
    for (var i = 1;i < 41;i++) {
        postsToCreate.push(i);
    }
    for(const i of postsToCreate) {
        console.log('creating new post '+i);
            const post = {		
                title: faker.commerce.productName(),
                description: faker.lorem.text(),
                author: '5e1e44d82236de3cecc09df1',
                price: faker.commerce.price(),
                // location: await getCoordinates(faker.address.city()+', '+faker.address.stateAbbr())
                location: {
                    coordinates:[faker.address.longitude(),faker.address.latitude()],
                    formattedAddress:faker.address.city()+', '+faker.address.stateAbbr()
                }
                ,
                images: [
                    {
                        url: await faker.image.imageUrl(),
                        public_id:'12345'
                    }
                ]
            }
            console.log(post);
            await Post.create(post);
    }
    console.log('40 new posts created');
}

module.exports = seedPosts;