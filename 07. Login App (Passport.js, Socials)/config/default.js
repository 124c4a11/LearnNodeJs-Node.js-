const path = require('path');


module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
  crypto: {
    hash: {
      length: 128,
      iterations: 10
    }
  },
  mongodb: {
    debug: true,
    uri: 'mongodb://localhost/passport_facebook'
  },
  server: {
    site: {
      host: 'http://localhost',
      port: 3000,
    }
  },
  providers: {
    facebook: {
      appId: '',
      appSecret: '',
      passportOptions: {
        scope: ['email']
      }
    },
    vk: {
      appId: '',
      appSecret: '',
      passportOptions: {
        scope: ['email']
      }
    }
  },
};
