const passport = require('../libs/passport');


exports.post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true, // ctx.flash()
  successFlash: true
});
