exports.post = (ctx) => {
  ctx.logout();
  ctx.redirect('/');
};
