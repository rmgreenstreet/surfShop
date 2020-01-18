const faker = require('faker');
const Post = require('./models/post');
const NodeGeocoder = require('node-geocoder');
const cities = require('./cities');


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
	for(const i of new Array(600)) {
		const random1000 = Math.floor(Math.random() * 1000);
		const title = faker.lorem.word();
		const description = faker.lorem.text();
		const postData = {
			title,
			description,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
			author: {
		    '_id' : '5bb27cd1f986d278582aa58c',
		    'username' : 'ian'
		  }
		}
		let post = new Post(postData);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		post.save();
	}
	console.log('600 new posts created');
}

module.exports = seedPosts;