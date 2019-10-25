const asyncHandler = require('../utils/async-handler');
const ErrorResponse = require('../utils/error-response');
const Subscription = require('../models/subscription');

const userService = require('../services/user');
const planService = require('../services/plan');
const subscriptionService = require('../services/subscription');

/* 
  @desc     Get subscriptions list
  @route    [GET] /api/v1/subscription
  @access   Private
*/

exports.getSubscriptions = asyncHandler(async (req, res) => {
  console.log('getSubscriptionList is called');
  try {
    // query, userId
    const userId = req.userData.userId;

    // projection
    const projection = { stripeId: 0, __v: 0 };

    // $1: subscription array
    const subscriptions = await Subscription.find(filter, projection).byUser(userId);

    // success response
    res.status(200).json({ subscriptionList: subscriptions });
  } catch {
    // error response
    res.status(500).json({
      message: 'Failed to fetch mails!'
    });
  }
});

/* 
  @desc     Get single subscription by id
  @route    [GET] /api/v1/subscription/:id
  @access   Private
*/

exports.getSubscription = asyncHandler(async (req, res) => {
  console.log('getSubscription is called');
  try {
    //
    const userId = req.userData.userId;

    // filter, projection
    const filter = { _id: req.params.id, userId: req.userData.userId };
    const projection = { stripeId: 0, __v: 0 };

    // $1: subscription array
    const subscription = await Subscription.find(filter, projection).byUser(userId);

    // success response
    res.status(200).json({ subscription: subscription });
  } catch {
    // error response
    res.status(500).json({
      message: 'Failed to fetch mails!'
    });
  }
});

/* 
  @desc     Update a subscription - isAutoRenew, isAllowOverage
  @route    [PATCH] /api/v1/subscription/:id
  @access   Private
*/

exports.updateSubscription = asyncHandler(async (req, res, next) => {
  // retrive update
  const userId = req.userData.userId;
  const { isAllowOverage, isCancelAtPeriodEnd } = req.body;

  // cancel subscription at period end
  if (isCancelAtPeriodEnd) {
    const subscription = await subscriptionService.cancelSubscriptionAtPeriodEnd(subscriptionId);
    if (subscription) return res.json({ ok: true, result: { n: 1, nModified: 1 } });
    else return next(new ErrorResponse(`Please check subscriptionId: ${req.params.id}`, 400));
  }

  // filter, options, update
  const filter = { _id: req.params.id };
  const options = { runValidators: true };
  const update = { $set: { isAllowOverage } };
  for (const param in update) if (!update[param]) delete update[param];

  // $1: update subscription
  const result = await Subscription.updateOne(filter, update, options)
    .byUser(userId)
    .isActive();
  if (result.n === 0) {
    return next(new ErrorResponse('No subscription is updated', 400));
  }

  // success response
  res.status(201).json({ ok: true, result: { n: result.n, nModified: result.nModified } });
});

/* 
  @desc     Create subscription 
  @route    [POST] /api/v1/subscription
  @access   Private
*/

exports.createSubscription = asyncHandler(async (req, res, next) => {
  // userId, source, planIds, addressId, mailboxNo
  const userId = req.userData.userId;
  const { source, planIds, addressId, mailboxNo } = req.body;

  // validation service calls
  const userPromise = userService.findUserById(userId);
  const plansPromise = planService.findPlans({ _id: { $in: planIds } });
  const subscriptionPromise = Subscription.findOne()
    .byUser(userId)
    .byAddress(addressId)
    .isActive();

  // $1: resolve all validation promises
  const promises = [userPromise, plansPromise, subscriptionPromise];
  let [user, plans, subscription] = await Promise.all(promises);

  // v1: check all plans are valid
  const foundPlanIds = plans.map(plan => plan._id.toString());
  const unknowPlanIds = planIds.filter(planId => !foundPlanIds.includes(planId));
  if (unknowPlanIds.length) {
    return next(new ErrorResponse(`Unknow plan: ${unknowPlanIds}`));
  }

  // v2: check all plans are equal in billing interval
  const planBillingIntervals = plans.map(plan => plan.intervalInMonth);
  const intervalsAllEqual = planBillingIntervals.every((value, idx, arr) => value === arr[0]);
  if (!intervalsAllEqual) {
    return next(
      new ErrorResponse(`Plans have different billing period: ${planBillingIntervals} [month]`)
    );
  }

  // v3: check existing active subscription on the same address
  if (subscription) {
    return next(
      new ErrorResponse(`User has existing plan on the same address: planId : ${subscription._id}`)
    );
  }

  // v4: check user is customer in stripe
  if (!user.stripeId && !source) {
    return next(new ErrorResponse('Need to specify user payment source', 400));
  } else if (!user.stripeId && source) {
    // $2: create custtomer account on stripe
    user = await userService.creteStripeCustomerAccount(user, source);
  }

  // $3: create subscription
  const result = await subscriptionService.createSubscription(user, plans, addressId, mailboxNo);

  // success response
  res.status(200).json({
    ok: 200,
    data: {
      subscription: result.subscription,
      requireAction: result.stripe.latest_invoice.payment_intent.status === 'requires_action',
      paymentIntent: result.stripe.latest_invoice.payment_intent
    }
  });
});

/* 
  @desc     Cancel a subscription - change subscription stauts to 'CANCELLED' || change isCancelAtPeriodEnd to true
  @route    [DELETE] /api/v1/subscription/:id
  @access   Private
*/

exports.cancelSubscription = asyncHandler(async (req, res, next) => {
  // subscriptionId
  const subscriptionId = req.params.id;
  const { cancelAtPeriodEnd } = req.body;

  // find subscription
  let subscription;
  if (cancelAtPeriodEnd) {
    subscription = await subscriptionService.cancelSubscriptionAtPeriodEnd(subscriptionId); // immediate cancel
  } else {
    subscription = await subscriptionService.cancelSubscription(subscriptionId); // cancel at period end
  }

  // check result
  if (!subscription) {
    return next(new ErrorResponse(`Please check subscriptionId: ${subscriptionId}`, 400));
  }

  // success response
  res.status(200).json({ ok: true, result: { n: 1 }, data: { subscription } });
});
