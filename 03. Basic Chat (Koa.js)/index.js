const
  app = require('./app'),
  config = require('config');


app.listen(config.get('port'));
