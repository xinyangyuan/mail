const mongoose = require('mongoose');

// Schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  read_flag: { type: Boolean, required: true },
  star_flag: { type: Boolean, required: true },
  envelopKey: { type: String, required: true },
  contentPDFKey: { type: String, required: true }
});

// Export mongoose model
module.exports = mongoose.model('Mail', postSchema, 'mails');
