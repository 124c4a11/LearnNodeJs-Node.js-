const path = require('path');


module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: process.env.SECRET || 'mysecret',

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
    uri: 'mongodb://localhost/passport_register'
  },

  server: {
    host: 'http://localhost',
    port: 3000,
  },

  providers: {
    facebook: {
      appId: '',
      appSecret: '',
      passportOptions: {
        scope: ['email']
      }
    },
  },

  mailer: {
    gmail: {
      user: '',
      password: ''
    },
    senders:  {
      // transactional emails, register/forgot pass etc
      default:  {
        fromEmail: 'fromEmail',
        fromName:  'fromName',
        signature: "<em>С уважением,<br>Javascript</em>"
      },
    }
  },
};
