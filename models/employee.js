const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  national_id: {
    type: String,
    required: true,
    unique: [true]
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  date_of_birth: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: '{VALUE} is not supported'
    },
    required: [true, 'status is required']
  },
  position: {
    type: String,
    default: 'manager',
    enum: {
      values: ['manager', 'developer', 'designer', 'tester', 'devops'],
      message: '{value} is not supported'
    },
    required: true
  },
  CreateDate: {
    type: Date,
    default: new Date()
  }
});

schema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = doc.id;
    delete returnedObj._id;
    delete returnedObj.__v;
  }
});

module.exports = mongoose.model('Employee', schema);