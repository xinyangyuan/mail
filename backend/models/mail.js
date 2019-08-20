const mongoose = require('mongoose');
const diffHistory = require('mongoose-diff-history/diffHistory');

const timestampPlugin = require('./plugins/timestamp');

// Schema
const mailSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  envelopKey: { type: String, required: true },
  contentPDFKey: {
    type: String,
    required: function() {
      return this.status !== 'CREATED' && this.status !== 'SCANNING';
    }
  },
  flags: {
    type: {
      read: { type: Boolean },
      star: { type: Boolean },
      issue: { type: Boolean },
      terminated: { type: Boolean }
    },
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

// use timestamp plugin/middleware
mailSchema.plugin(timestampPlugin);

// diff history plugin/middleware
// mailSchema.plugin(diffHistory.plugin, { omit: ['flags'] });

// Export mongoose model
module.exports = mongoose.model('Mail', mailSchema, 'mails');
