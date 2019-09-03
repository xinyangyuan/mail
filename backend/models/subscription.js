const mongoose = require('mongoose');
const timestampPlugin = require('./plugins/timestamp');

/*
  Helper Functions:
*/

function anchorDay() {
  const isMidnight =
    this.startDate.getHours() + this.startDate.getSeconds() + this.startDate.getMilliseconds() ===
    0;
  return isMidnight ? this.startDate.getDate() : this.startDate.getDate() + 1;
}

/*
  Schema:
*/

const terminationSchema = mongoose.Schema({
  reason: { type: String, required: true },
  date: { type: Date, required: true }
});

const stripeItems = mongoose.Schema(
  {
    stripeId: { type: String, required: true }, // subscription item si_xxx
    product: { type: String, enum: ['mail', 'scan', 'delivery', 'translation'], required: true },
    type: { type: String, enum: ['metered', 'licensed'], required: true }
  },
  { _id: false }
);

const subscriptionSchema = mongoose.Schema({
  planIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  stripeId: {
    type: String,
    required: function() {
      return ['ACTIVE', 'PAST_DUE', 'CANCELED'].includes(this.status);
    }
  },
  stripeItems: [{ type: stripeItems }],
  status: {
    type: String,
    enum: ['INCOMPLETE', 'ACTIVE', 'PAST_DUE', 'CANCELED'],
    default: 'INCOMPLETE'
  },
  startDate: { type: Date, required: true, immutable: true },
  anchorDay: { type: Number, default: anchorDay },
  periodStartDate: {
    type: Date,
    default: function() {
      return this.startDate;
    }
  },
  periodEndDate: { type: Date, required: true },
  isAutoRenew: { type: Boolean, default: true },
  isAllowOverage: { type: Boolean, default: false },
  termination: { type: terminationSchema }
});

/*
  Virtual Attribute:
*/

subscriptionSchema.virtual('endDate').get(function() {
  if (!this.isAutoRenew) {
    return this.periodEndDate;
  } else {
    return null;
  }
});

subscriptionSchema.virtual('isTerminated').get(function() {
  return typeof this.termination === 'undefined' || this.periodEndDate > Date.now();
});

subscriptionSchema.virtual('isActive').get(function() {
  return !(typeof this.termination === 'undefined' || this.periodEndDate > Date.now());
});

/*
  Query helper:
*/

subscriptionSchema.query.isActive = function() {
  return this.where({ periodEndDate: { $gt: Date.now() }, termination: { $exists: false } });
};

subscriptionSchema.query.byPlan = function(planId) {
  return this.where({ planId: planId });
};

subscriptionSchema.query.byUser = function(userId) {
  return this.where({ userId: userId });
};

subscriptionSchema.query.byAddress = function(addressId) {
  return this.where({ addressId: addressId });
};

/*
  Plug-ins:
*/

// use timestamp plugin/pre-middleware
subscriptionSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');
