const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const timestampPlugin = require('./plugins/timestamp');

/*
  Schema:
*/

const userSchema = mongoose.Schema({
  name: {
    type: { first: { type: String }, last: { type: String } },
    required: true
  },
  email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
  password: { type: String, required: true },
  mailboxes: [
    mongoose.Schema(
      {
        mailboxNo: { type: Number, min: 0, max: 500, required: true },
        addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true }
      },
      { _id: false }
    )
  ],
  stripeId: { type: String },
  paymentSource: { type: String },
  isSender: { type: Boolean, required: true },
  isConfirmed: { type: Boolean, required: true }
});

/*
  Virtual Attributes:
*/

userSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});

/*
  Query helper:
*/

userSchema.query.byEmail = function(email) {
  return this.where({ email: email });
};

userSchema.query.byAddress = function(address) {
  return this.where({ address: address });
};

/*
  Plug-ins:
*/

// use unique validator plugin/middleware
userSchema.plugin(uniqueValidator);

// use timestamp plugin/pre-middleware
userSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('User', userSchema, 'users');
