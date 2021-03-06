var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose')
//var mongoDB = 'mongodb://127.0.0.1/projekt';
var mongoDB = "mongodb+srv://test:test@projekt.0habu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'))

var usersRouter = require('./routes/userRoutes');
var cestaRouter = require('./routes/CestaRoutes');
var photoRouter = require('./routes/photoRoutes');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

var hbs = require('hbs');
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("equal", require("handlebars-helper-equal"))

app.use(cors());

var session = require('express-session');
var MongoStore = require('connect-mongo');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: mongoDB})
}));

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({limit:'100mb'})); // for incoming Request Object as json

app.use(express.urlencoded({limit:'100mb', extended: true }));
app.use('/users', usersRouter);
app.use('/cesta', cestaRouter);
app.use('/photo', photoRouter);

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


module.exports = app;

