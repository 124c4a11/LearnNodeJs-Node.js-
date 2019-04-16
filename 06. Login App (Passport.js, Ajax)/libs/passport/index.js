const
  passport = require('passport'),
  User = require('../../models/User');

const localStrategy = require('./strategies/local');


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, done));


passport.use(localStrategy);


module.exports = passport;
