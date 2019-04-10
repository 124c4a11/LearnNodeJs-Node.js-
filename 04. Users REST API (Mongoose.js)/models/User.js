const
  mongoose = require('../libs/mongoose'),
  pick = require('lodash/pick');


const publicFields = ['email', 'displayName'];


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: 'Такой email уже существует',
      required: 'E-mail пользователя не должен быть пустым.',
      validate: [
        {
          validator(value) {
            return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
          },
          message: 'Некорректный email.'
        }
      ]
    },

    displayName: {
      type: String,
      required: 'У пользователя должно быть имя',
      unique: 'Такое имя уже существует'
    }
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret, options) {
        return pick(ret, [...publicFields, '_id']);
      }
    }
  }
);


userSchema.statics.publicFields = publicFields;


module.exports = mongoose.model('User', userSchema);
