const
  session = require('koa-session'),
  mongoose = require('../libs/mongoose'),
  mongooseStore = require('koa-session-mongoose');


exports.init = (app) => app.use(session({
  signed: false,

  store: mongooseStore.create({
    name: 'Sessins',
    expires: 3600 * 4,
    connection: mongoose
  })
}, app));
