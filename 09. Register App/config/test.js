module.exports = {
  mongodb: {
    debug: false,
    uri: 'mongodb://localhost/passport_register_test'
  },

  providers: {
    facebook: {
      test: {
        login: 'gmailUser',
        password: 'gmailPassword'
      }
    }
  }
};
