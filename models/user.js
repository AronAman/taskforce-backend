const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  password: {
    type: String,
    default: null
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

schema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = doc._id;
    delete returnedObj._id;
    delete returnedObj.__v;
  }
});

module.exports = mongoose.model('User', schema);