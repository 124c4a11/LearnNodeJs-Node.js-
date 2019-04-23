const path = require('path');
const defer = require('config/defer').deferConfig;


module.exports = {
  secret: 'mysecret',

  root: process.cwd(),

  templatesRoot: path.join(process.cwd(), 'templates'),

  crypto: {
    hash: {
      length: 128,
      iterations: 10
    }
  },

  logger: {
    // logLevel
    level: 'info'
  },

  mongodb: {
    debug: false,
    uri: process.env.MONGODB_URI || 'mongodb://localhost/passport_socketio'
  },

  redis: {
    uri: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  },

  server: {
    host: 'http://localhost',
    port: process.env.PORT || 3000,
    domain: process.env.DOMAIN || 'http://localhost:3000',
  },

  providers: {
    vkontakte: {
      appId: '', // passport
      appSecret: '',
      callbackURI: defer((cfg) => {
        return `${cfg.server.domain}/oauth/vkontakte`;
      }),
      passportOptions: {
        scope: ['email']
      }
    },

    github: {
      appId: '',
      appSecret: '',
      callbackURI: defer((cfg) => {
        return `${cfg.server.domain}/oauth/github`;
      }),
      passportOptions: {
        scope: ['user:email']
      }
    }
  },

  mailer: {
    gmail: {
      user: '',
      password: ''
    },
    senders:  {
      // transactional emails, register/forgot pass etc
      default:  {
        email: '',
        name:  '',
        signature: "<em>С уважением,<br>Javascript</em>"
      },
    }
  },
};
