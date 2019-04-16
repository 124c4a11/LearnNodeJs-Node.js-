const passport = require('../libs/passport');


exports.post = async (ctx, next) => {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (user) {
      const { displayName, email } = user;

      await ctx.login(user);

      ctx.body = { displayName, email };
    } else {
      ctx.status = 401;
      ctx.body = info;
    }
  })(ctx,next);
}
