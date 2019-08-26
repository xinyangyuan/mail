const mongoose = require('mongoose');
const timestampPlugin = require('./plugins/timestamp');

/*
  Helper Functions:
*/

function anchorDay() {
  const isMidnight =
    this.start_date.getHours() +
      this.start_date.getSeconds() +
      this.start_date.getMilliseconds() ===
    0;
  return isMidnight ? this.start_date.getDate() : this.start_date.getDate() + 1;
}

/*
  Schema:
*/

const subscriptionSchema = mongoose.Schema({
  plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripe_id: { type: String, required: true },
  start_date: { type: Date, required: true, immutable: true },
  anchor_day: { type: Number, default: anchorDay },
  period_start_date: {
    type: Date,
    default: function() {
      return this.start_date;
    }
  },
  period_end_date: { type: Date, required: true },
  auto_renew: { type: Boolean, default: true },
  termination: {
    type: { reason: String, date: Date }
  }
});

/*
  Virtual Attribute:
*/

subscriptionSchema.virtual('end_date').get(function() {
  if (!this.auto_renew) {
    return this.period_end_date;
  } else {
    return null;
  }
});

subscriptionSchema.virtual('is_terminated').get(function() {
  return typeof this.termination === 'undefined' || this.period_end_date > Date.now();
});

subscriptionSchema.virtual('is_active').get(function() {
  return !(typeof this.termination === 'undefined' || this.period_end_date > Date.now());
});

/*
  Query helper:
*/

subscriptionSchema.query.isActive = function() {
  return this.where({ period_end_date: { $gt: Date.now() }, termination: { $exists: false } });
};

subscriptionSchema.query.byUser = function(userId) {
  return this.where({ user_id: userId });
};

/*
  Plug-ins:
*/

// use timestamp plugin/pre-middleware
subscriptionSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');
