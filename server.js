"use strict";

let express = require('express'),
    compression = require('compression'),
    db = require('./server/pghelper'),
    app = express();

    var passport = require('passport'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
    var session = require('express-session');
    var passportLinkedIn = require('./app/auth/linkedinauth');


    let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    let newUser = (req, res, next) => {
      console.log(req);
      var firstName = req.firstName;
      var lastName = req.lastName;
      var emailAddress = req.emailAddress;
      var company = req.company;
      var title = req.title;
      var pictureUrl = req.pictureUrl;

      var sql = "INSERT INTO users (firstName, lastName, emailAddress, company, title, pictureUrl) VALUES ('" + firstName + "','" + lastName + "','" + emailAddress + "','" + company + "','" + title + "','" + pictureUrl + "')";

      db.query(sql, null)
        .then(user => res.json("new user created!"))
        .catch(next);
    };

    let findOrCreateUser = (req, res, next) => {
      var email = req.query.email;
      var sql = "SELECT * FROM users WHERE emailaddress = $1";

      db.query(sql, [email])
      .then(function (user) {
        console.log("Not being called", user);
        return res.json({"user" : user})
      })
      .catch(next);
    };

    let queryUsers = (req, res, next) => {
      var params = req.query;
      var firstname = req.query.firstname;
      var lastname;
      var sql = "SELECT * FROM users WHERE firstname = $1";
      var loggedInUser = req.user;

      console.log("logged in user: ", loggedInUser);

      db.query(sql, ["Scott"])
        .then(function (user) {
          return res.json({"user" : user})
        })
        .catch(next);
    };

app.set('port', process.env.PORT || 3000);

app.use(compression());

app.use(session({
secret: 'keyboard cat',
resave: true,
saveUninitialized: true
}));

app.use('/', express.static(__dirname + '/www'));
app.use('/account', express.static(__dirname + '/www'));
app.use('/main', express.static(__dirname + '/www'));
app.use('/css', express.static(__dirname + '/node_modules/bulma/css'));
app.use('/activity', express.static(__dirname + '/www'));
app.use('/account', express.static(__dirname + '/www'));
app.use('/login', express.static(__dirname + '/www'));

// Adding CORS support
app.all('*', function (req, res, next) {
    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        next();
    }
});


app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/linkedin',
  passport.authenticate('linkedin'),
  function(req, res) {
    console.log("shouldn't be here");
  });

app.use('/auth/linkedin/callback',

  passportLinkedIn.authenticate('linkedin', { failureRedirect: '/auth/linkedin' }),
  function(req, res, next) {
    // Successful authentication
    var sql = "SELECT * FROM users WHERE emailaddress = $1";

    db.query(sql, [req.user._json.emailAddress])
    .then(function (user) {
      if (!user[0]) {
        newUser(req.user._json, res, next);
      } else {
      return res.json({"user" : user})
      }
    })
    .catch(next);
    // res.json(req.user._json.emailAddress);
  });

app.use('/newUserCreation', newUser);
app.use('/searchUsers', queryUsers);
app.use('/newUserWelcome', express.static(__dirname + '/www'));

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
