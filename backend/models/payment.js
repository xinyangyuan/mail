const mongoose = require('mongoose');
const timestampPlugin = require('./plugins/timestamp');

/*
  Schema:
*/

const paymentSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  stripe_id: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['NEW_SUBSCRIPTION, RENEW_SUBSCRIPTION'], required: true },
  date: { type: Date, immutable: true, required: true }
});

/*
  Static Method:
*/

paymentSchema.statics.findByYearMonth = function(
  year,
  month,
  user_id = undefined,
  projection = {},
  options = {}
) {
  const conditions = {
    ...{ user_id },
    ...{ date: { $gte: new Date(year, month - 1), $lt: new Date(year, month) } }
  };
  return this.find(conditions, projection, options);
};

/*
  Query Helper:
*/

paymentSchema.query.byUser = function(userId) {
  return this.where({ user_id: userId });
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

/*
  Plug-ins:
*/

// use timestamp plugin/pre-middleware
paymentSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('Payment', paymentSchema, 'payments');
