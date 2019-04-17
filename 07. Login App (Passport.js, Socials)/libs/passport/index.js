const passport = require('koa-passport');
const User = require('../../models/User');

const localStrategy = require('./strategies/local');
const facebookStrategy = require('./strategies/facebook');
const vkStrategy = require('./strategies/vk');


passport.serializeUser((user, done) => done(null, user.id));


passport.deserializeUser((id, done) => User.findById(id, done));


passport.use(localStrategy);
passport.use(facebookStrategy);
passport.use(vkStrategy);


module.exports = passport;
