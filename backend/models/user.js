const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// user unique requirement
userSchema.plugin(uniqueValidator);

// export mongoose model
module.exports = mongoose.model('User', userSchema, 'users');
