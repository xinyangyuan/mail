const mongoose = require('mongoose');
// const diffHistory = require('mongoose-diff-history/diffHistory');

const timestampPlugin = require('./plugins/timestamp');

/*
  Schema:
*/

const mailFlagSchema = mongoose.Schema(
  {
    read: { type: Boolean, required: true },
    star: { type: Boolean, required: true },
    issue: { type: Boolean, required: true },
    terminated: { type: Boolean, required: true }
  },
  { _id: false }
);

const mailSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  envelopKey: { type: String },
  contentPDFKey: {
    type: String,
    required: function() {
      return this.status !== 'CREATED' && this.status !== 'SCANNING';
    }
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
    required: true
  }
});

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

mailSchema.query.byUser = function(userId, isSender = false) {
  if (isSender) {
    return this.where({ senderId: userId });
  } else {
    return this.where({ receiverId: userId });
  }
};

/*
  Plugins:
*/

mailSchema.plugin(timestampPlugin); // use timestamp plugin/middleware

// mailSchema.plugin(diffHistory.plugin, { omit: ['flags'] }); // diff history plugin/middleware

/*
  Export mongoose model:
*/

module.exports = mongoose.model('Mail', mailSchema, 'mails');
