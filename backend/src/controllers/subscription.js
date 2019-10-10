const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Plan = require('../models/plan');
const Subscription = require('../models/subscription');
const User = require('../models/user');

const SubscriptionService = require('../services/subscription');

/*
  Controller: get all user's subscriptions [GET]
*/

exports.getSubscriptionList = async (req, res) => {
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
};

/*
  Controller: get one subscription by id [GET]
*/

exports.getSubscription = async (req, res) => {
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
};

/*
  Controller: update subscription [PATCH]
*/

exports.updateSubscription = async (req, res) => {
  console.log('updateSubscription is Called');
  try {
    // retrive update
    const userId = req.userData.userId;
    const { isAutoRenew, isAllowOverage } = req.body;

    // filter, options
    const filter = { _id: req.params.id };
    const options = { runValidators: true };

    // update
    const update = { $set: { isAutoRenew, isAllowOverage } };
    for (const param in update) if (!update[param]) delete update[param];

    // $1: update subscription
    const result = await Subscription.updateOne(filter, update, options)
      .byUser(userId)
      .isActive();
    if (result.n === 0) {
      console.log('no mail is updated by the patch request');
    }

    // success response
    res.status(201).json({
      message: 'Subscription patched successfully',
      subscription: result
    });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to patch subscription update' });
  }
};

/*
  Controller: create new subscription [GET]
*/

exports.createSubscription = async (req, res) => {
  // start session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // userId, planId, addressId, source, mailboxNo
    const userId = mongoose.Types.ObjectId(req.userData.userId);
    const addressId = mongoose.Types.ObjectId(req.body.addressId);
    const planIds = req.body.planIds; // [ planId, planId ]
    const source = req.body.source ? req.body.source : undefined;
    const mailboxNo = req.body.mailboxNo;

    // $1: find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Unknow user' });
    } else if (!user.stripeId && !source) {
      // new customer needs to provide payment source information
      return res.status(401).json({ message: 'Need to specify user payment source' });
    }

    // $2: find plans
    const filter = { _id: { $in: planIds } };
    const plans = await Plan.find(filter);
    if (!plans.length) return res.status(401).json({ message: 'Unknow plans' });
    if (plans.length !== planIds.length)
      return res.status(401).json({ message: `Only can find ${plans}` });

    // $3: create stripe user for newly sign-up customer
    if (!user.stripeId) {
      // $3-1: stripe create customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        source: source.id,
        metadata: { id: user._id.toString() }
      });
      user.stripeId = customer.id;
      // $3-2: update user document stripe field
      const filter = { _id: userId };
      const update = { $set: { stripeId: customer.id } };
      await User.updateOne(filter, update, { runValidators: true });
    }

    // $4: create subscription
    // $4-1: no active subscription on the same address
    let subscription = await Subscription.findOne()
      .byUser(userId)
      .byAddress(addressId)
      .isActive();
    if (subscription) {
      return res.status(401).json({ message: 'User has active subscription on this address' });
    }

    // $4-2: create subscription
    // START TRANSACTION
    subscription = await SubscriptionService.newSubscription(userId, planIds, addressId, session);

    // $5: create stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: user.stripeId,
      items: plans.flatMap(plan => plan.stripeItems),
      metadata: { id: subscription._id.toString(), mailboxNo },
      expand: ['latest_invoice.payment_intent']
    });

    // COMMIT TRANSACTION
    await session.commitTransaction();
    session.endSession();

    // success reponse
    res
      .status(201)
      .json({ status: 'success', paymentIntent: stripeSubscription.latest_invoice.payment_intent });
  } catch (error) {
    console.log(error);

    // ABORT TRANSACTION
    await session.abortTransaction();
    session.endSession();

    // error response
    res.status(401).json({ message: error.message });
  }
};

/*
  Controller: cancel subscription [DEL]
*/
