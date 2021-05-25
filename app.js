var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var cartRouter = require('./routes/cart');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var app = express();


// view engine setup


var Book = require('./models/Book');
var types = require('./models/types');
Book.find(function (err, books){
  if (err) console.log(err);
  else app.locals.books = books;
});
types.find(function(err, t){
  if (err) console.log(err);
  else app.locals.types = t;
})


const config = require("./config/database");

// kết nối đến database.
const mongoose = require ("mongoose");
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Kết nối thành công");
});


require('./config/passport');
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login= req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.cart = req.session.cart;
  next();
})
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/', indexRouter);

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
var POST = process.env.PORT || 3000 ;
app.listen(POST, function(){

})

module.exports = app;
