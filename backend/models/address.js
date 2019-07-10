const mongoose = require('mongoose');

// Schema
const addressSchema = mongoose.Schema({
  address: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Export mongoose model
module.exports = mongoose.model('Address', addressSchema, 'addresses');
