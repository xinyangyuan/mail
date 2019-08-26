const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const timestampPlugin = require('./plugins/timestamp');

/*
  Schema:
*/

const planSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  amount: { type: String, required: true },
  interval: {
    type: {
      unit: { type: String, enum: ['month', 'year'] },
      count: {
        type: Number,
        min: 0,
        validate: {
          validator: Number.isInteger
        }
      }
    },
    required: true
  },
  currency: { type: String, enum: ['usd', 'cny', 'gbp'], default: 'usd' },
  metered_plan: { type: Boolean, required: true },
  mail_credit: {
    type: Number,
    min: 0,
    required: function() {
      return [!this.metered_plan, 'mail_credit is required for non-metered plan'];
    }
  },
  scan_credit: {
    type: Number,
    min: 0,
    required: function() {
      return [!this.metered_plan, 'scan_credit is required for non-metered plan'];
    }
  },
  stripe_id: { type: String, required: true }
});

/*
  Virtual Attribute:
*/

planSchema.virtual('mail_credit').get(function() {
  return this.metered_plan ? 0 : this.mail_credit;
});

planSchema.virtual('scan_credit').get(function() {
  return this.metered_plan ? 0 : this.scan_credit;
});

/*
  Plug-ins:
*/

// use unique validator plugin/middleware
planSchema.plugin(uniqueValidator);

// use timestamp plugin/pre-middleware
planSchema.plugin(timestampPlugin);

// export mongoose model
module.exports = mongoose.model('Plan', planSchema, 'plans');
