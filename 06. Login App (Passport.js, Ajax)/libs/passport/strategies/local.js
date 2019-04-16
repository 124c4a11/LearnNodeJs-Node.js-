const
  LocalStrategy = require('passport-local'),
  User = require('../../../models/User');


module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },

  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Пользователь c указаным email не существует!' });
      }

      const isValidPassowrd = await user.checkPassword(password);

      if (!isValidPassowrd) {
        return done(null, false, { message: 'Неверный пароль!' });
      }

      return done(null, user, { message: 'Добро пожаловать!' });
    } catch (err) {
      console.error(err);
      done(err);
    }
  }
);
