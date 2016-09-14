// server.js

// BASE SETUP FOR TEST SERVER
// =============================================================================

// call the packages we need
require('dotenv').load();
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');    // used for parsing incoming HTTP requests
var passport   = require('passport');       // used for authentication
var FBStrategy = require('passport-facebook').Strategy; // used for Facebook login
var TWStrategy = require('passport-twitter').Strategy; // used for Twitter login
var GoogStrategy = require('passport-google-oauth').OAuth2Strategy; // used for Google+
var LineStrategy = require('passport-line').Strategy; // used for line
var cors       = require('cors');           // enables CORS requests



// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new FBStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: 'https://stworld.herokuapp.com/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

// Configure the Twitter strategy for use by Passport.
//
// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new TWStrategy({
    consumerKey: process.env.TW_CONSUMER_KEY,
    consumerSecret: process.env.TW_CONSUMER_SECRET,
    callbackURL: 'https://stworld.herokuapp.com/login/twitter/return'
  },
  function(token, tokenSecret, profile, cb) {
    // In this example, the user's Twitter profile is supplied as the user
    // record.  In a production-quality application, the Twitter profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

// TODO: Set up Line Channel ID and Channel secret
// Configure the Google Plus strategy for use by Passport.
//

passport.use(new GoogStrategy({
    clientID: process.env.GOOG_CLIENT_ID,
    clientSecret: process.env.GOOG_CLIENT_SECRET,
    callbackURL: 'https://stworld.herokuapp.com/index.html'
  },
  function(token, tokenSecret, profile, cb) {
    // In this example, the user's Twitter profile is supplied as the user
    // record.  In a production-quality application, the Twitter profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

// TODO: Set up Line Channel ID and Channel secret
// Configure the Line strategy for use by Passport.
//
passport.use(new LineStrategy({
    channelID: process.env.LINE_CHANNEL_ID,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    callbackURL: 'https://stworld.herokuapp.com/index.html'
  },
  function(token, tokenSecret, profile, cb) {
    // In this example, the user's Line profile is supplied as the user
    // record.  In a production-quality application, the Twitter profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



// for serving static files
app.use(express.static('public'));
app.use(require('morgan')('combined'));
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// FACEBOOK TEST ROUTES
//
//
//

app.get('/login_fb',
  function(req, res){
    res.render('fb_login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile_fb',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('fb_profile', { user: req.user });
  });

// TWITTER TEST ROUTES
//
//
//
app.get('/login_tw',
  function(req, res){
    res.render('tw_login');
  });

app.get('/login/twitter',
  passport.authenticate('twitter'));

app.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile_tw',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('tw_profile', { user: req.user });
  });

// LINE TEST ROUTES
//
//
//
app.get('/login_line',
  function(req, res){
    res.render('line_login');
  });

app.get('/login/line',
  passport.authenticate('line'));

app.get('/login/line/return', 
  passport.authenticate('line', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile_line',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('line_profile', { user: req.user });
  });

// GOOGLE PLUS TEST ROUTES
//
//
//
app.get('/login_google',
  function(req, res){
    res.render('goog_login');
  });

app.get('/login/google',
  passport.authenticate('google',{ scope: ['profile', 'email'],callbackURL: 'https://stworld.herokuapp.com/index.html' }));

app.get('/login/google/return', 
  passport.authenticate('google', { scope: ['profile', 'email'], callbackURL: 'https://stworld.herokuapp.com/index.html'  }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile_google',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('goog_profile', { user: req.user });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('stworld server running on port ' + port);
