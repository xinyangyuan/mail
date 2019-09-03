const mongoose = require('mongoose');
const timestampPlugin = require('./plugins/timestamp');

/*
  Schema:
*/

const invoiceSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  mailIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mail' }],
  scanIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mail' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

/*
  Virtual Attributes:
*/

invoiceSchema.virtual('mailCount').get(function() {
  return this.mailIds.length;
});

invoiceSchema.virtual('scanCount').get(function() {
  return this.scanIds.length;
});

/*
  Static Method:
*/

invoiceSchema.statics.findByYearMonth = function(
  year,
  month,
  userId = undefined,
  projection = {},
  options = {}
) {
  const conditions = {
    ...{ userId },
    ...{ startDate: { $gte: new Date(year, month - 1), $lt: new Date(year, month) } }
  };
  return this.find(conditions, projection, options);
};

/*
  Query Helper:
*/

invoiceSchema.query.currentPeriod = function() {
  return this.where({ startDate: { $lte: Date.now() }, endDate: { $gt: Date.now() } });
};

invoiceSchema.query.byUser = function(userId) {
  return this.where({ userId: userId });
};

/*
  Plug-ins:
*/

// use timestamp plugin/pre-middleware
invoiceSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('Invoice', invoiceSchema, 'invoices');
