const mongoose = require('mongoose');
const timestampPlugin = require('./plugins/timestamp');

// Schema
const mailSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  envelopKey: { type: String, required: true },
  contentPDFKey: { type: String, required: true },
  flags: {
    type: { read: { type: Boolean }, star: { type: Boolean }, issue: { type: Boolean } },
    default: { read: false, star: false, issue: false }
  }
});

// use timestamp plugin/middleware
mailSchema.plugin(timestampPlugin);

// Export mongoose model
module.exports = mongoose.model('Mail', mailSchema, 'mails');
