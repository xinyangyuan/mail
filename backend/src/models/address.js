const mongoose = require('mongoose');

const NUMBER_MAILBOXES = 500;

/*
  Schema:
*/

const receiverSchema = new mongoose.Schema(
  {
    mailboxNo: { type: Number, min: 1, max: NUMBER_MAILBOXES, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    line1: {
      type: String,
      required: true
    },
    line2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false
    },
    receivers: {
      type: [receiverSchema],
      select: false
    }
  },
  { timestamps: true }
);

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

addressSchema.query.byUser = function(userId, userRole) {
  switch (userRole) {
    case 'USER':
      return this.where({ 'receivers.receiverId': { $eq: userId } });
    case 'SENDER':
      return this.where({ senderId: userId });
    case 'ADMIN':
      return this.where({});
  }
};

// Export mongoose model
module.exports = mongoose.model('Address', addressSchema, 'addresses');
