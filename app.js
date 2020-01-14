require('dotenv').config({ path: '.env' });
const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const serveFavicon = require('serve-favicon');
const passport = require('passport');
const expressSession = require('express-session');
const User = require('./models/user');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const flash = require('connect-flash');
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
app.use(express.urlencoded({ extended: false }));
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
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//configure passport and sessions

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port, () => {
	console.log("server has started, listening on port "+port);
});

module.exports = app;
