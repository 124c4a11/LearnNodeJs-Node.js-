const
  LocalStrategy = require('passport-local'),
  User = require('../../../models/User');


module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },

  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Нет такого пользователя.' });
      }

      const isValidPassword = await user.checkPassword(password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Пароль неверен.' });
      }

      return done(null, user, { message: 'Добро пожаловать!' });
    } catch (err) {
      console.error(err);
      done(err);
    }
  }
);
