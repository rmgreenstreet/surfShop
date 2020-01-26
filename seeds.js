const faker = require('faker');
const Post = require('./models/post');
const Review = require('./models/review');
const User = require('./models/user');
const cities = require('./cities');
const fs = require('fs');
const path = require('path');

const seedImages = 'public/img/seed';
let imageArray = [];

fs.readdir(seedImages, (err, files) => {
	if(err) {
		return console.error('could not read the source directory: ',err);
	}
	files.forEach(file => {
		console.log(file);
		imageArray.push('/img/seed/'+file);
	});
	console.log('imageArray populated with '+imageArray.length+' images');
});

async function generateUsers() {

	console.log('creating 50 users');
	try {
		await User.deleteMany({username:!'robert'});
		console.log('all current users deleted');
	}
	catch (err) {
		console.log('err');
	}
	try {
		for (let i = 0;i < 50;i++) {
		const user = await User.register({username:(faker.name.firstName()+faker.name.lastName()),email:faker.internet.email()},faker.internet.password());
		console.log(`user ${i+1}, username: ${user.username} registered`);
		}
		console.log('50 users registered');
	}
	catch (err) {
		console.log(err);
	}
	console.log('50 users registered');
};

async function generateReviews(post, users) {
	const randomReviewCount = Math.ciel(Math.random() * 6);
	console.log(`creating ${randomReviewCount} reviews for ${post.title}`);
	try {
		for(let i = 0;i < randomReviewCount;i++){
			console.log(`creating review # ${i+1} for post '${post.title}'`);
			const randomRating = Math.ceil(Math.random() *6);
			const randomUserIndex = Math.floor(Math.random() *users.length);
			let reviewData = {
				body:faker.lorem.paragraph(),
				rating:randomRating,
				author:users[randomUserIndex]._id
			}
			const newReview = await Review.create(reviewData);
			console.log(`review # ${i+1} added to post`)
			post.reviews.push(newReview);
		}
		await post.save();
	}
	catch (err) {
		console.log(err);
	}
};
  
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
	await generateUsers();
	const allUsers = await User.find({});
	const numberOfPosts = Math.ciel(Math.random()*500);
	console.log(`creating ${numberOfPosts} posts`);
	await Post.deleteMany({});
	console.log('all posts removed');
	for(const i of new Array(numberOfPosts)) {
		const random1000 = Math.floor(Math.random() * 1000);
		const randomUserIndex = Math.floor(Math.random() * allUsers.length);
		const title = faker.commerce.productName();
		const description = faker.lorem.text();
		const price = faker.commerce.price();
		const postData = {
			title,
			description,
			price,
			images:[],
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
			author:  allUsers[randomUserIndex]._id,
		}
		for(let i = 0;i < 4;i++){
			let randomIndex = Math.floor(Math.random() * (imageArray.length+1));
			postData.images.push({url:imageArray[randomIndex]});
		}
		let post = await new Post(postData);
		await generateReviews(post,allUsers);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		await post.save();
	}
	console.log(`${numberOfPosts} posts created`);
}

module.exports = seedPosts;