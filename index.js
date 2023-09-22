var createError = require('http-errors');
var express = require('express');
const helmet = require('helmet');
var cors = require('cors')
var path = require('path');
var rfs = require('rotating-file-stream')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
var connectDatabase = require('./lib/mongoose');
var session = require('express-session');
var passport = require('passport');
var initPassport = require('./lib/passport');
const MongoStore = require('connect-mongo');
var Domain = require('./bin/whitelist');

process.env.TZ='UTC'

connectDatabase();
initPassport();

var app = express();
app.use(helmet());

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (Domain.whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true ,credentials:true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

  app.use(cors(corsOptionsDelegate));


app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var advancedOptions = {}
var sess = {
  secret:process.env.SECRET_KEY,
  store: MongoStore.create({
    mongoUrl: process.env.ATLAS_MONGODB,
    dbName:process.env.DATABASE_NAME,
    mongoOptions: advancedOptions // See below for details
  }),
  resave:false,
  saveUninitialized: true,
  cookie:{
    name:'sessionId',
    maxAge:12*60*60*1000,
  }
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.httpOnly = true;
  sess.cookie.secure = true; // serve secure cookies
  sess.cookie.sameSite = 'none'; // serve
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

//parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//logger
// create a write stream (in append mode)
var accessLogStream = rfs.createStream('access.log', {
  interval: '96M', // rotate 8 years
  path: path.join(__dirname, 'log')
})
//setup logger
  app.use(logger('combined',{stream: accessLogStream}));


//encoding
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//static page
app.use(express.static(path.join(__dirname, 'public')));

//Ban user who try to force message api;
const bannedList = new Set();

const CheckBannedList = (req,res,next) => {
  const userIp = req.socket.remoteAddress;
  if(bannedList.has(userIp.split(',')[0])){
    return res.status(403).send({status:false,message:'User has been banned'});
  }
  next();
}

const defaultLimit = rateLimit({
  windowMs:5*60*1000,
  max:200,
  standardHeaders: true, 
	legacyHeaders: false,
  handler:(req,res)=>{
    return res.status(429).send({message:'Too many request, please try again later'})
  }
})

//routes
const { verify_user_email} = require('./authentication');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const prefix = '/v1/nba-hotel'
app.use(prefix+'/',defaultLimit, indexRouter);
app.use(prefix+'/logger',defaultLimit, require('./routes/logger'));
app.use(prefix+'/whitelist',defaultLimit, require('./routes/whitelist'));
app.use(prefix+'/role',defaultLimit,require('./routes/roles'));
app.use(prefix+'/users',defaultLimit,usersRouter);
app.use(prefix+'/signup',defaultLimit,[verify_user_email.checkDuplicateUsernameOrEmail],require('./routes/signup'));
app.use(prefix+'/signin',defaultLimit,require('./routes/signin'));
app.use(prefix+'/admin',defaultLimit,require('./routes/admin'));
app.use(prefix+'/hotel',defaultLimit,require('./routes/hotel'));
app.use(prefix+'/room',defaultLimit,require('./routes/room'));
app.use(prefix+'/upload',defaultLimit,require('./routes/upload'));
app.use(prefix+'/booking',defaultLimit,require('./routes/booking'));
app.use(prefix+'/checkin',defaultLimit,require('./routes/checkin'));
app.use(prefix+'/payment',defaultLimit,require('./routes/payment'));
app.use(prefix+'/province',defaultLimit,require('./routes/province'));
app.use(prefix+'/invite',defaultLimit,require('./routes/invitation'));
app.use(prefix+'/partner',defaultLimit,require('./routes/partner'));
app.use(prefix+'/calendar',defaultLimit,require('./routes/calendar'))
app.use(prefix+'/report',defaultLimit,require('./routes/report'));
app.use(prefix+'/billing',defaultLimit,require('./routes/billing'));
app.use(prefix+'/task',defaultLimit,require('./routes/task'));
app.use(prefix+'/increment',defaultLimit,require('./routes/increment'));

//partner api
var apiPartnerAuth = require('./authentication/apiPartnerAuth');
app.use(prefix+'/api',defaultLimit,apiPartnerAuth,require('./routes/api'));
//AOC
app.use(prefix+'/aocflight',defaultLimit,apiPartnerAuth,require('./routes/aoc'));
//end partner api

app.use(prefix+'/message',CheckBannedList,rateLimit({
  windowMs:5*60*1000,
  max:5,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler:(req,res)=>{
    const userIp = req.socket.remoteAddress;
    bannedList.add(userIp.split(',')[0]);
    return res.status(429).send({message:'Too many request, please try again later'});
  }
}),require('./routes/message'));

//get Date
app.use(prefix+'/date',(req,res)=>{

  const date = new Date();
  
  res.send(date)
})


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
