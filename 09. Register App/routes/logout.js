exports.post = async (ctx, next) => {
  ctx.logout();
  ctx.redirect('/');
};
