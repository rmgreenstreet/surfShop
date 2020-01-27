const faker = require('faker');
const Post = require('./models/post');
const Review = require('./models/review');
const User = require('./models/user');
const cities = require('./cities');
const fs = require('fs');
const path = require('path');

//path to filler/stock images to use for posts
const seedImages = 'public/img/seed';
let imageArray = [];

//look in that directory and for each file, add the path to an array
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

//called within seedPosts function: delete all users (except you/admin) and generate 50 more
async function generateUsers() {
	console.log('creating 50 users');
	try {
		//change the username key to the username you want to keep
		await User.deleteMany({username:!'robert'});
		console.log('all current users deleted');
	}
	catch (err) {
		console.log('err');
	}
	try {
		//register 50 new users with random usernames and passwords generated by faker
		//originally had some errors thrown because faker has a limited selection of first names, so concatenated first and last names
		for (let i = 0;i < 50;i++) {
		const user = await User.register({username:(faker.name.firstName()+faker.name.lastName()),email:faker.internet.email()},faker.internet.password());
		console.log(`user ${i+1}, username: ${user.username} registered`);
		}
		console.log('50 users registered');
	}
	catch (err) {
		console.log(err);
	}
};

//called within the seedPosts function for each post, generate between 1 and 5 reviews, with between 1 and 5 stars each
async function generateReviews(post, users) {
	//.ceil() used to make sure at least one rating was created
	const randomReviewCount = Math.ceil(Math.random() * 5);
	console.log(`creating ${randomReviewCount} reviews for ${post.title}`);
	try {
		for(let i = 0;i < randomReviewCount;i++){
			console.log(`creating review # ${i+1} for post '${post.title}'`);
			//.ceil() used to make sure rating iss at least 1
			const randomRating = Math.ceil(Math.random() *5);
			//choose a random user from all users (including you) as the author
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

async function seedPosts() {
	//delete/generate users
	await generateUsers();
	//find all users to be used as authors for posts/reviews
	const allUsers = await User.find({});
	//decide how many posts between 100 and 500 to create
	const numberOfPosts = Math.floor(Math.random()*(500-100) +100);
	console.log(`creating ${numberOfPosts} posts`);
	//delete all existing posts
	await Post.deleteMany({});
	console.log('all posts removed');
	for(const i of new Array(numberOfPosts)) {
		//choose which of the 1000 cities in the cities.js file to use to create the post location
		const random1000 = Math.floor(Math.random() * 1000);
		//choose which of the 50 users to set as the author
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
		//choose 4 random images from the imagesArray to use as images for this post and push them into the property's array
		for(let i = 0;i < 4;i++){
			const randomIndex = Math.floor(Math.random() * (imageArray.length+1));
			postData.images.push({url:imageArray[randomIndex]});
		}
		let post = await new Post(postData);
		//generate reviews, passing in the new post itself and the array of all users
		await generateReviews(post,allUsers);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		await post.save();
	}
	console.log(`${numberOfPosts} posts created`);
}

module.exports = seedPosts;