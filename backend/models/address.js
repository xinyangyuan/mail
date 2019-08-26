const mongoose = require('mongoose');
const timestampPlugin = require('./plugins/timestamp');

/*
  Schema:
*/

const addressSchema = mongoose.Schema({
  address: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

/*
  Query helper:
*/

addressSchema.query.bySender = function(senderId) {
  return this.where({ senderId: senderId });
};

addressSchema.query.byReceiver = function(receiverId) {
  return this.where({ receiverId: receiverId });
};

addressSchema.query.byUser = function(userId, isSender) {
  if (isSender) {
    return this.where({ senderId: userId });
  } else {
    return this.where({ receiverId: userId });
  }
};

/*
  Plugins:
*/

// use timestamp plugin/middleware
addressSchema.plugin(timestampPlugin);

// Export mongoose model
module.exports = mongoose.model('Address', addressSchema, 'addresses');
