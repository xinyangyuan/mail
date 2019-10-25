const mongoose = require('mongoose');

/*
  Child Schema:
*/

const mailFlagSchema = new mongoose.Schema(
  {
    read: { type: Boolean, required: true },
    star: { type: Boolean, required: true },
    issue: { type: Boolean, required: true },
    terminated: { type: Boolean, required: true }
  },
  { _id: false }
);

const statusLogSchema = new mongoose.Schema(
  {
    event: { type: String, required: true, immutable: true },
    user: { type: String, required: true, immutable: true },
    reason: { type: String, immutable: true, default: 'change due to user request' }
  },
  { timestamps: true }
);

/*
  Schema:
*/

const mailSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    envelopKey: {
      type: String,
      select: false
    },
    contentPDFKey: {
      type: String,
      required: function() {
        return this.status !== 'CREATED' && this.status !== 'SCANNING';
      },
      select: false
    },
    flags: {
      type: mailFlagSchema,
      default: { read: false, star: false, issue: false, terminated: false }
    },
    status: {
      type: String,
      enum: [
        'CREATED',
        'SCANNING',
        'SCANNED_ARCHIVED',
        'UNSCANNED_ARCHIVED',
        'RE_SCANNING',
        'COLLECTED',
        'TRASHED'
      ],
      default: 'CREATED'
    },
    statusLogs: {
      type: [statusLogSchema],
      select: false
    }
  },
  { timestamps: true }
);

/*
  Static Methods:
*/

mailSchema.statics.findBySender = function(senderId, filter = {}, projection = {}, options = {}) {
  const filter_ = { ...filter, ...{ senderId: senderId } };
  return this.find(filter_, projection, options);
};

mailSchema.statics.findByReceiver = function(
  receiverId,
  filter = {},
  projection = {},
  options = {}
) {
  const filter_ = { ...filter, ...{ receiverId: receiverId } };
  return this.find(filter_, projection, options);
};

mailSchema.statics.findByUser = function(
  isSender,
  userId,
  filter = {},
  projection = {},
  options = {}
) {
  if (isSender) {
    return this.findBySender(userId, filter, projection, options);
  } else {
    return this.findByReceiver(userId, filter, projection, options);
  }
};

/*
  Query helper:
*/

mailSchema.query.bySender = function(senderId) {
  return this.where({ senderId: senderId });
};

mailSchema.query.byReceiver = function(receiverId) {
  return this.where({ receiverId: receiverId });
};

mailSchema.query.byUser = function(userId, userRole) {
  switch (userRole) {
    case 'USER':
      return this.where({ receiverId: userId });
    case 'SENDER':
      return this.where({ senderId: userId });
    case 'ADMIN':
      return this.where({});
  }
};

/*
  Export mongoose model:
*/

module.exports = mongoose.model('Mail', mailSchema, 'mails');
