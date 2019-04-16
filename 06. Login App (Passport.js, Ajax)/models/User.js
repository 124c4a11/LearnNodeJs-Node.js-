const
  mongoose = require('../libs/mongoose'),
  crypto = require('crypto'),
  config = require('config');


const userSchema = new mongoose.Schema (
  {
    displayName: {
      type: String,
      required: 'Введите имя пользователя!'
    },

    email: {
      type: String,
      unique: 'Пользователь с таким email уже зарегистрирован!',
      require: 'Введите email',
      validate: [
        {
          validator(value) {
            return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
          },
          message: 'Некоректный email!'
        }
      ]
    },

    passwordHash: {
      type: String,
      required: true
    },

    salt: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);


function generatePasswordHash(salt, password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      config.get('crypto.hash.iterations'),
      config.get('crypto.hash.length'),
      'sha512',
      (err, key) => {
        if (err) return reject(err);
        resolve(key.toString('hex'));
      }
    );
  });
}


userSchema.methods.setPassword = async function(password) {
  if (password !== undefined && password < 4) {
    throw new Error('Длина пароля не должна быть меньше 4 символов');
  }

  this.salt = crypto.randomBytes(config.get('crypto.hash.length')).toString('hex');
  this.password = await generatePasswordHash(this.salt, password);
};


userSchema.methods.checkPassword = async function(password) {
  if (!password) return false;

  const hash = await generatePasswordHash(this.salt, password);

  return hash === this.passwordHash;
}


module.exports = mongoose.model('User', userSchema);
