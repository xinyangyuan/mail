const mongoose = require('mongoose');

/*
  Schema:
*/

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    stripeId: { type: String, required: true }, // payment_intent : 'pi_xxx'
    stripeInvoiceUrl: { type: String, required: true },
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, immutable: true, required: true }
  },
  { timestamps: true }
);

/*
  Virtual Attribute:
*/

paymentSchema.virtual('stripeInvoicePdf').get(function() {
  return this.stripeInvoiceUrl + '/pdf';
});

/*
  Static Method:
*/

paymentSchema.statics.findByYearMonth = function(
  year,
  month,
  userId = undefined,
  projection = {},
  options = {}
) {
  const conditions = {
    ...{ userId },
    ...{ date: { $gte: new Date(year, month - 1), $lt: new Date(year, month) } }
  };
  return this.find(conditions, projection, options);
};

/*
  Query Helper:
*/

paymentSchema.query.byUser = function(userId) {
  return this.where({ userId: userId });
};

paymentSchema.query.currentMonth = function() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return this.where({
    date: { $gte: new Date(year, month), $lt: new Date(year, month + 1) }
  });
};

paymentSchema.query.currentQuarter = function() {
  const now = new Date();
  const year = now.getFullYear();
  const quarter = Math.floor(now.getMonth() / 3); // 0-1-2-3
  const month = quarter * 3;
  return this.where({
    date: { $gte: new Date(year, month), $lt: new Date(year, month + 3) }
  });
};

paymentSchema.query.currentYear = function() {
  const now = new Date();
  const year = now.getFullYear();
  return this.where({
    date: { $gte: new Date(year), $lt: new Date(year + 1) }
  });
};

// export mongoose model
module.exports = mongoose.model('Payment', paymentSchema, 'payments');
