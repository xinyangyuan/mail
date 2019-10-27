const stripe = require('stripe')(process.env.STRIPE_KEY);

const Subscription = require('../models/subscription');

/*
  Service: create a new subscription
*/

exports.createSubscription = async (user, plans, addressId, mailboxNo) => {
  // caclculate period end date
  const plan = plans[0]; // select an arbitrary plan
  const periodInMonth = plan.intervalInMonth;
  const startDate = new Date();
  const periodEndDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + periodInMonth,
    startDate.getDate() + 1
  );

  // userId, planIds
  const userId = user._id;
  const planIds = plans.map(plan => plan._id);

  // database subscription
  const subscription = await new Subscription({
    planIds,
    userId,
    addressId,
    startDate,
    periodEndDate
  }).save();

  // stripe subscription
  const stripeSub = await stripe.subscriptions.create(
    {
      customer: user.stripeId,
      items: plans.flatMap(plan => plan.stripeItems),
      metadata: { id: subscription._id.toString(), mailboxNo },
      expand: ['latest_invoice.payment_intent']
    },
    { idempotency_key: subscription._id }
  );

  return { subscription, stripe: stripeSub };
};

/*
  Service: activate newly registered subscription 
*/

exports.activateSubscription = async (subscriptionId, session) => {
  // filter, update, options
  const filter = { _id: subscriptionId };
  const update = { $set: { status: 'ACTIVE' } };
  const options = session
    ? { new: true, runValidators: true }
    : { new: true, runValidators: true, session };

  // promise
  const subscription = await Subscription.findOneAndUpdate(filter, update, options);
  return subscription;
};

/*
  Service: renew subscription 
*/

exports.renewSubscription = async (subscriptionId, session) => {
  // $1: find subscription
  const subscription = await Subscription.findById(subscriptionId).populate('planIds');
  const planInterval = subscription.planIds[0].intervalInMonth;

  // new period start and end date
  const oldEndDate = subscription.periodEndDate;
  const periodStartDate = oldEndDate;
  const periodEndDate = new Date(oldEndDate.setMonth(oldEndDate.getMonth() + planInterval));

  // filter, update, options
  const filter = { _id: subscriptionId };
  const update = { $set: { status: 'ACTIVE', periodStartDate, periodEndDate } };
  const options = session
    ? { new: true, runValidators: true }
    : { new: true, runValidators: true, session };

  // promise
  return await Subscription.findOneAndUpdate(filter, update, options);
};

/*
  Service: renew subscription [call from webhook]
*/

exports.updateSubscriptionStatus = async (subscriptionId, status, statusLog) => {
  // filter, update, options
  const filter = { _id: subscriptionId };
  const update = { $set: { status }, $addToSet: { statusLogs: statusLog } };
  const options = { runValidators: true, new: true };

  // promise
  return await Subscription.findOneAndUpdate(filter, update, options);
};

/*
  Find active subscription by userId => Promise<subscription[]>
*/

exports.findActiveSubscriptionsByUserId = userId => {
  return Subscription.find({ userId })
    .isActive()
    .exec();
};

/*
  Cancel a subscription immediately
*/

exports.cancelSubscription = async subscriptionId => {
  // status change log
  const event = `[Status] transition from ACTIVE to CANCELED`;
  const reason = `User request to cancel event immediately`;
  const statusLog = { event, reason };

  // filter, options, update
  const filter = { _id: subscriptionId, status: { $ne: 'CANCELED' } };
  const options = { runValidators: true, new: true };
  const update = {
    $set: { status: 'CANCELED' },
    $addToSet: { statusLogs: statusLog }
  };

  // promises
  const subscription = await Subscription.findOneAndUpdate(filter, update, options);
  subscription && stripe.subscriptions.del(subscription.stripeId); // only call stripe if there is subscription return
  return subscription;
};

/*
  Cancel a subscription at period end
*/

exports.cancelSubscriptionAtPeriodEnd = async subscriptionId => {
  // status change log
  const event = `[isCancelAtPeriodEnd] transition from ${false} to ${true}`;
  const reason = `User request to stop auto-billing and cancel subscription at period end`;
  const statusLog = { event, reason };

  // filter, options, update
  const filter = { _id: subscriptionId };
  const options = { runValidators: true, new: true };
  const update = {
    $set: { isCancelAtPeriodEnd: true },
    $addToSet: { statusLogs: statusLog }
  };

  // promises
  const subscription = await Subscription.findOneAndUpdate(filter, update, options);
  subscription && // only call stripe if there is subscription return
    stripe.subscriptions.update(subscription.stripeId, { cancel_at_period_end: true });
  return subscription;
};
