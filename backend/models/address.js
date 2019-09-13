const mongoose = require('mongoose');

const timestampPlugin = require('./plugins/timestamp');

const NUMBER_MAILBOXES = 500;

/*
  Schema:
*/

const addressSchema = mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receivers: [
    mongoose.Schema(
      {
        mailboxNo: { type: Number, min: 1, max: NUMBER_MAILBOXES, required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
      },
      { _id: false }
    )
  ]
});

/*
  Virtual Attributes:
*/

addressSchema.virtual('vacantMailboxNos').get(function() {
  const mailboxes = Array.from(Array(NUMBER_MAILBOXES), (x, i) => i + 101); // [1,2,3,4,..]
  const takenMailboxes = this.receivers.map(receiver => receiver.mailboxNo);
  return mailboxes.filter(mailbox => !takenMailboxes.includes(mailbox));
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
