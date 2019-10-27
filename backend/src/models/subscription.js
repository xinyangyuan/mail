const mongoose = require('mongoose');

/*
  Helper Functions:
*/

function getAnchorDay() {
  const isMidnight =
    this.startDate.getHours() + this.startDate.getSeconds() + this.startDate.getMilliseconds() ===
    0;
  return isMidnight ? this.startDate.getDate() : this.startDate.getDate() + 1;
}

/*
  Child Schema:
*/

const stripeItemsSchema = new mongoose.Schema(
  {
    stripeId: { type: String, required: true }, // subscription item si_xxx
    product: { type: String, enum: ['mail', 'scan', 'delivery', 'translation'], required: true },
    type: { type: String, enum: ['metered', 'licensed'], required: true }
  },
  { _id: false } // no unique _id
);

const statusLogSchema = new mongoose.Schema(
  {
    event: { type: String, immutable: true, required: true },
    reason: { type: String, immutable: true, required: true },
    user: { type: String, immutable: true },
    createdAt: { type: Date, default: Date.now() }
  },
  { _id: true }
);

/*
  Schema:
*/

const subscriptionSchema = new mongoose.Schema(
  {
    planIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
      }
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },
    stripeId: {
      type: String,
      required: function() {
        return ['ACTIVE', 'PAST_DUE', 'CANCELED'].includes(this.status);
      }
    },
    stripeItems: [
      {
        type: stripeItemsSchema
      }
    ],
    status: {
      type: String,
      enum: ['INCOMPLETE', 'INCOMPLETE_EXPIRED', 'ACTIVE', 'PAST_DUE', 'CANCELED'],
      default: 'INCOMPLETE'
    },
    startDate: {
      type: Date,
      required: true,
      immutable: true
    },
    anchorDay: {
      type: Number,
      default: getAnchorDay
    },
    periodStartDate: {
      type: Date,
      default: function() {
        return this.startDate;
      }
    },
    periodEndDate: {
      type: Date,
      required: true
    },
    isAllowOverage: {
      type: Boolean,
      default: false
    },
    isCancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    statusLogs: [
      {
        type: statusLogSchema
      }
    ]
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

subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'ACTIVE' && this.periodEndDate > Date.now();
});

/*
  Query helper:
*/

subscriptionSchema.query.isActive = function() {
  return this.where({ periodEndDate: { $gt: Date.now() }, status: { $eq: 'ACTIVE' } });
};

subscriptionSchema.query.isActiveOrIncomplete = function() {
  return this.where({
    periodEndDate: { $gt: Date.now() },
    status: { $in: ['ACTIVE', 'INCOMPLETE'] }
  });
};

subscriptionSchema.query.byPlan = function(planId) {
  return this.where({ planId: planId });
};

subscriptionSchema.query.byAddress = function(addressId) {
  return this.where({ addressId: addressId });
};

subscriptionSchema.query.byUser = function(userId, userRole) {
  switch (userRole) {
    case 'USER':
      return this.where({ userId: userId });
    case 'ADMIN':
      return this.where({});
    // case 'SENDER':
    //   return this.where({});
  }
};

// export mongoose model
module.exports = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');
