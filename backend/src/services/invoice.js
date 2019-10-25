const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Invoice = require('../models/invoice');

/*
  Service: create mail usage record
*/

exports.createMailUsageRecord = (mail, subscription) => {
  // current billing period
  const now = new Date();
  const [year, month, day] = [now.getFullYear(), now.getMonth(), subscription.anchorDay];
  const startDate = new Date(year, month, day);
  const endDate = new Date(year, month + 1, day);

  // userId, mailId, subscriptionId
  const userId = mongoose.Types.ObjectId(mail.receiverId);
  const mailId = mongoose.Types.ObjectId(mail._id);
  const subscriptionId = mongoose.Types.ObjectId(subscription._id);

  // stripe subscription item
  const stripeSubItem = subscription.stripeItems.filter(
    item => item.product === 'mail' && item.type === 'metered'
  )[0].stripeId;

  // filter, update, options
  const filter = { userId, subscriptionId, startDate, endDate };
  const update = { $addToSet: { mailIds: mailId } };
  const options = { runValidators: true, upsert: true, new: true };

  return Invoice.findOneAndUpdate(filter, update, options).then(() =>
    stripe.usageRecords.create(
      stripeSubItem,
      { quantity: 1, timestamp: Math.floor(Date.parse(mail.createdAt) / 1000) },
      { idempotency_key: mail._id.toString() }
    )
  );
};

/*
  Service: create scan usage record
*/

exports.createScanUsageRecord = (mail, subscription) => {
  // current billing period
  const now = new Date();
  const [year, month, day] = [now.getFullYear(), now.getMonth(), subscription.anchorDay];
  const startDate = new Date(year, month, day);
  const endDate = new Date(year, month + 1, day);

  // userId, mailId, subscriptionId
  const userId = mongoose.Types.ObjectId(mail.receiverId);
  const mailId = mongoose.Types.ObjectId(mail._id);
  const subscriptionId = mongoose.Types.ObjectId(subscription._id);

  // stripe subscription item
  const stripeSubItem = subscription.stripeItems.filter(
    item => item.product === 'scan' && item.type === 'metered'
  )[0].stripeId;

  // filter, update, options
  const filter = { userId, subscriptionId, startDate, endDate };
  const update = { $addToSet: { mailIds: mailId } };
  const options = { runValidators: true, upsert: true, new: true };

  return Invoice.findOneAndUpdate(filter, update, options).then(() =>
    stripe.usageRecords.create(
      stripeSubItem,
      { quantity: 1, timestamp: Math.floor(Date.parse(mail.createdAt) / 1000) },
      { idempotency_key: mail._id.toString() }
    )
  );
};

/*
  Service: check mail service overage : Promise<boolean>
*/

exports.checkMailOverage = userId => {
  return Invoice.findOne()
    .populate({
      path: 'subscriptionId',
      populate: {
        path: 'planIds',
        match: { product: 'mail' }
      }
    })
    .byUser(userId)
    .currentPeriod()
    .then(checkOverageHandler);
};

/*
  Service: check scan service overage : Promise<boolean>
*/

exports.checkScanOverage = userId => {
  return Invoice.findOne()
    .populate({
      path: 'subscriptionId',
      populate: {
        path: 'planIds',
        match: { product: 'scan' }
      }
    })
    .byUser(userId)
    .currentPeriod()
    .then(checkOverageHandler);
};

/*
  Helper: check scan service overage
*/

const checkOverageHandler = invoice => {
  // case 1: user has no usage in current billing period
  if (!invoice) {
    return false;
  }
  // case 2:
  const plan = invoice.subscriptionId.planIds[0];
  const mailCredit = plan.flatCredit;
  if (mailCredit === -1) {
    return false; // -1 => inf (pay-as-you-go-plan)
  }
  // default case
  return invoice.mailCount > mailCredit;
};
