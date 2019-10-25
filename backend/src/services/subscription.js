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
  Service: renew subscription 
*/

exports.updateSubscriptionStatus = async (subscriptionId, status) => {
  // filter, update, options
  const filter = { _id: subscriptionId };
  const update = { $set: { status } };
  const options = { runValidators: true, new: true };

  // promise
  return await Subscription.findOneAndUpdate(filter, update, options);
};

/*
  Find active subscription by userId
  FIXME: the user might have mutilple active subscriptions => so findSubscriptions
*/

exports.findActiveSubscriptionByUserId = userId => {
  return Subscription.findOne()
    .byUser(userId)
    .isActive()
    .exec();
};

/*
  Cancel a subscription immediately
*/

exports.cancelSubscription = subscriptionId => {
  // reason, current date, canceelationEvent
  const reason = 'User request to cancel from client side';
  const date = new Date();
  const cancellationEvent = { reason, date };

  // filter, options, update
  const filter = { _id: subscriptionId };
  const options = { runValidators: true, new: true };
  const update = {
    $set: { status: 'CANCELED' },
    $addToSet: { cancellationEvents: cancellationEvent }
  };

  // promise
  return Subscription.findOneAndUpdate(filter, update, options).then(
    subscription =>
      // only call stripe if there is subscription return
      subscription && stripe.subscriptions.del(subscription.stripeId)
  );
};

/*
  Cancel a subscription at period end
*/

exports.cancelSubscriptionAtPeriodEnd = subscriptionId => {
  // reason, current date, canceelationEvent
  const reason =
    'User request to stop auto-billing and cancel subscription at period end from client side';
  const date = new Date();
  const cancellationEvent = { reason, date };

  // filter, options, update
  const filter = { _id: subscriptionId };
  const options = { runValidators: true, new: true };
  const update = {
    $set: { isCancelAtPeriodEnd: true },
    $addToSet: { cancellationEvents: cancellationEvent }
  };

  // promise
  return Subscription.findOneAndUpdate(filter, update, options).then(
    subscription =>
      subscription && // only call stripe if there is subscription return
      stripe.subscriptions.update(subscription.stripeId, { cancel_at_period_end: true })
  );
};
