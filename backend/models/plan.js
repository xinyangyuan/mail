const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const timestampPlugin = require('./plugins/timestamp');

/*
  Schema:
*/

const intervalSchema = mongoose.Schema(
  {
    unit: { type: String, enum: ['month', 'year'], required: true },
    count: { type: Number, min: 0, validate: { validator: Number.isInteger }, required: true }
  },
  { _id: false }
);

const planSchema = mongoose.Schema({
  // standard
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  product: { type: String, enum: ['mail', 'scan', 'delivery', 'translation'], required: true },
  interval: { type: intervalSchema, required: true },
  currency: { type: String, enum: ['usd', 'cny', 'gbp'], default: 'usd' },
  flatRate: { type: Number, min: 0, validate: { validator: Number.isInteger }, required: true },

  // metered plan
  isMetered: { type: Boolean, required: true },
  unitPrice: {
    type: Number,
    min: 0,
    validate: { validator: Number.isInteger },
    required: function() {
      return this.isMetered && !this.isTiered;
    }
  },
  unitLimit: {
    type: Number,
    min: -1,
    validate: { validator: Number.isInteger },
    required: function() {
      return this.isMetered && !this.isTiered;
    }
  },
  flatCredit: { type: Number, min: -1, validate: { validator: Number.isInteger } },

  // tiered plan
  isTiered: { type: Boolean, required: true },
  tierUnitPrices: [
    {
      type: Number,
      min: 0,
      validate: { validator: Number.isInteger },
      required: function() {
        return this.isTiered;
      }
    }
  ],
  tierUnitLimits: [
    {
      type: Number,
      min: -1,
      validate: { validator: Number.isInteger },
      required: function() {
        return this.isTiered;
      }
    }
  ],
  // tierFlatPrices: [{ type: Number, min: 0, validate: { validator: Number.isInteger } }],

  // stripe refs
  usageStripeId: { type: String, required: true },
  baseStripeId: {
    type: String,
    required: function() {
      return this.flatRate !== 0; // pay-as-you-go plan does not have base plan sub
    }
  }
});

/*
  Virtual Attribute:
*/

planSchema.virtual('intervalInMonth').get(function() {
  if (this.interval.unit === 'year') {
    return this.interval.count * 12;
  } else {
    return this.interval.count;
  }
});

planSchema.virtual('stripeId').get(function() {
  return this.usageStripeId; // default to usage metered stripe id
});

planSchema.virtual('stripeIds').get(function() {
  // ['plan_xx', 'plan_xx']
  return [this.usageStripeId, this.baseStripeId].filter(plan => typeof plan !== 'undefined');
});

planSchema.virtual('stripeItems').get(function() {
  return [
    {
      plan: this.usageStripeId,
      metadata: { planId: this._id.toString(), product: this.product, type: 'metered' }
    },
    {
      plan: this.baseStripeId,
      metadata: { planId: this._id.toString(), product: this.product, type: 'licensed' }
    }
  ].filter(item => typeof item.plan !== 'undefined');
});

planSchema.virtual('packageCredit').get(function() {
  if (this.flatCredit) {
    // metered plan with flatCredit
    return this.flatCredit;
  } else if (this.tierUnitPrices[0] === 0) {
    // tiered plan with free tier
    return this.tierUnitLimits[0];
  } else if (this.flatRate === 0) {
    // pay as you go plan
    return -1;
  }
});

/*
  Custom Validation:
*/

// v1: tiered plan must also be metered plan
planSchema.path('isTiered').validate(function(isTiered) {
  if (isTiered) {
    return this.isMetered === true;
  } else {
    return true;
  }
}, 'Tiered plan has to be metered plan');

// v2: if plan has flatCredit, it has to be metered plan
planSchema.path('flatCredit').validate(function(flatCredit) {
  if (flatCredit) {
    return this.isMetered;
  } else {
    return true;
  }
}, 'Only metered plan can have free credit `flatCredit`');

// v3: if tiered plan has flatCredit, tierUnitPrices[0] == 0
planSchema.path('flatCredit').validate(function(flatCredit) {
  if (flatCredit) {
    return this.tierUnitPrices[0] === 0;
  } else {
    return true;
  }
}, 'Free-tier price `tierUnitPrices[0]` has to be 0');

// v4: if tiered plan has flatCredit, tierUnitLimits[0] == flatCredit
planSchema.path('flatCredit').validate(function(flatCredit) {
  if (flatCredit) {
    return flatCredit === this.tierUnitLimits[0];
  } else {
    return true;
  }
}, 'Free-tier limit `tierUnitLimits[0]` has to be the same as `flatCredit`');

// v5: final tier limit has to be infinite, tierUnitLimits[-1] == -1
planSchema.path('tierUnitLimits').validate(function(tierUnitLimits) {
  if (tierUnitLimits) {
    return tierUnitLimits.slice(-1)[0] === -1;
  } else {
    return true;
  }
}, 'Last tier limit `tierUnitLimits[-1]` has to be `-1` => unlimited');

// v6: tier prices & limits dimension align
planSchema.path('tierUnitLimits').validate(function(tierUnitLimits) {
  if (tierUnitLimits) {
    return tierUnitLimits.length === this.tierUnitPrices.length;
  } else {
    return true;
  }
}, '`tierUnitPrices` and `tierUnitLimits` has to have same length');

/*
  Plug-ins:
*/

// use unique validator plugin/middleware
planSchema.plugin(uniqueValidator);

// use timestamp plugin/pre-middleware
planSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('Plan', planSchema, 'plans');
