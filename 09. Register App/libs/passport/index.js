const passport = require('koa-passport');
const User = require('../../models/User');

const localStrategy = require('./strategies/local');
const facebookStrategy = require('./strategies/facebook');


passport.serializeUser((user, done) => done(null, user.id));


passport.deserializeUser((id, done) => User.findById(id, done));


passport.use(localStrategy);
passport.use(facebookStrategy);


module.exports = passport;
