const
  mongoose = require('mongoose'),
  beautifyUnique = require('mongoose-beautiful-unique-validation'),
  config = require('config');


mongoose.set('debut', config.get('mongodb.debug'));
mongoose.plugin(beautifyUnique);
mongoose.connect(config.get('mongodb.uri'));


module.exports = mongoose;
