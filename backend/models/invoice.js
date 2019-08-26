const mongoose = require('mongoose');
const timestampPlugin = require('./plugins/timestamp');

/*
  Schema:
*/

const invoiceSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  mail_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mail' }],
  scan_mail_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mail' }]
});

/*
  Virtual Attributes:
*/

invoiceSchema.virtual('total_mail').get(function() {
  return this.mail_ids.length;
});

invoiceSchema.virtual('total_scan').get(function() {
  return this.scan_mail_ids.length;
});

/*
  Static Method:
*/

invoiceSchema.statics.findByYearMonth = function(
  year,
  month,
  user_id = undefined,
  projection = {},
  options = {}
) {
  const conditions = {
    ...{ user_id },
    ...{ start_date: { $gte: new Date(year, month - 1), $lt: new Date(year, month) } }
  };
  return this.find(conditions, projection, options);
};

/*
  Query Helper:
*/

invoiceSchema.query.currentPeriod = function() {
  return this.where({ start_date: { $lte: Date.now() }, end_date: { $gt: Date.now() } });
};

invoiceSchema.query.byUser = function(userId) {
  return this.where({ user_id: userId });
};

// const date = new Date()
// const currentYear = date.getFullYear, currentMonth = date.getMonth
// const anchorDate = subscription.start_date.getDate()

// const startDate = new Date(Date.UTC(currentYear, currentMonth, anchorDate));
// const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));

/*
  Plug-ins:
*/

// use timestamp plugin/pre-middleware
invoiceSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('Invoice', invoiceSchema, 'invoices');
