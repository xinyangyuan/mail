const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const timestampPlugin = require('./plugins/timestamp');

// Schema
const userSchema = mongoose.Schema({
  name: {
    type: { first: { type: String }, last: { type: String } },
    required: true
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSender: { type: Boolean, required: true },
  isConfirmed: { type: Boolean, required: true }
});

// virtual attribute
userSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});

// use unique validator plugin/middleware
userSchema.plugin(uniqueValidator);

// use timestamp plugin/middleware
userSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('User', userSchema, 'users');
