const
  pug = require('pug'),
  path = require('path'),
  config = require('config');


exports.init = (app) => app.use(async (ctx, next) => {
  ctx.locals = {
    get user() {
      return ctx.state.user;
    },

    get flash() {
      return ctx.getFlashMessages();
    }
  };

  ctx.render = (templatePath, locals) => {
    return pug.renderFile(
      path.join(config.get('templatesRoot'), templatePath),
      Object.assign({}, ctx.locals, locals)
    );
  };

  await next();
});
