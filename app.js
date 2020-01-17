require('dotenv').config({ path: '.env' });
const bodyParser = require('body-parser');
const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const serveFavicon = require('serve-favicon');
const passport = require('passport');
const expressSession = require('express-session');
const User = require('./models/user');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const seedPosts = require('./seeds');
const flash = require('connect-flash');
// const starability = require('starability');
const async = require('async');




const app = express();

//connect to database
mongoose.connect(process.env.DATABASE_URL,{
	useNewUrlParser:true, 
	useUnifiedTopology:true,
  useFindAndModify: false,
  useCreateIndex:true
}).then(() => {
	console.log('Connected to Mongoose DB')
}).catch(err => {
	console.log('error: ',err.message)
});

console.log("Environment database URL: "+process.env.DATABASE_URL);

//use ejs-locals for all ejs templates
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
console.log(path.resolve(__dirname, './public'))

app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
		secret:"surfs up brah",
		resave:false,
		saveUninitialized:false
		}));
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	// res.locals.error = req.flash("error");
	// res.locals.success = req.flash("success");
	next();
});

//configure passport and sessions

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set local variables middleware
app.use(function (req,res,next) {
	req.user={
		'_id': '5e1e44d82236de3cecc09df1',
		'username':'robert'
	};
	res.locals.currentUser = req.user;
	//set default page title if one is not specified
	res.locals.title='Surf Shop';
	//set success flash message
	res.locals.success = req.session.success || "";
	//delete flash message after sending it to the page so it doesn't show again
	delete req.session.success;
	//set success flash message
	res.locals.error = req.session.error || "";
	//delete flash message after sending it to the page so it doesn't show again
	delete req.session.error;
	//continue on to the next function in the middlware/route chain
	next();
})

//mount routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const reviewsRouter = require('./routes/reviews');


app.use('/', indexRouter);
app.use('/profile', usersRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	console.log(err);
	req.session.error = err.message;
	res.redirect('back');

//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
});


// seedPosts();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port, () => {
	console.log("server has started, listening on port "+port);
});

module.exports = app;
