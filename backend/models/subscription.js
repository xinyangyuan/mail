const mongoose = require('mongoose');

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
  Child Schema:
*/

const terminationSchema = new mongoose.Schema({
  reason: { type: String, required: true },
  date: { type: Date, required: true }
});

const stripeItemsSchema = new mongoose.Schema(
  {
    stripeId: { type: String, required: true }, // subscription item si_xxx
    product: { type: String, enum: ['mail', 'scan', 'delivery', 'translation'], required: true },
    type: { type: String, enum: ['metered', 'licensed'], required: true }
  },
  { _id: false }
);

/*
  Schema:
*/

const subscriptionSchema = new mongoose.Schema(
  {
    planIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    stripeId: {
      type: String,
      required: function() {
        return ['ACTIVE', 'PAST_DUE', 'CANCELED'].includes(this.status);
      }
    },
    stripeItems: [{ type: stripeItemsSchema }],
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
    termination: {
      type: terminationSchema,
      required: function() {
        return this.status === 'CANCELED';
      }
    }
  },
  { timestamps: true }
);

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
  return this.status === 'CANCELED' || this.periodEndDate < Date.now();
});

subscriptionSchema.virtual('isActive').get(function() {
  return this.status !== 'CANCELED' && this.periodEndDate > Date.now();
});

/*
  Query helper:
*/

subscriptionSchema.query.isActive = function() {
  return this.where({ periodEndDate: { $gt: Date.now() }, status: { $ne: 'CANCELED' } });
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

// export mongoose model
module.exports = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');
