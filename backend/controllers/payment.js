const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Subscription = require('../models/subscription');
const Payment = require('../models/payment');
const User = require('../models/user');

// public accessible: req.body = {user_id: xxxx, plan_id: xxxx, amount: number, type:xxx, source: xxxxxx}

/*
  Function: get payment list [GET]
*/

exports.getPaymentList = async (req, res, next) => {};

/*
  Function: fetch single payment by id [GET]
*/

exports.getPayment = async (req, res, next) => {};

/*
  Function: create a new payment [POST]
*/

exports.createPayment = async (req, res) => {
  // validation
  if (req.body.type !== 'NEW_SUBSCRIPTION, RENEW_SUBSCRIPTION') {
    return res.status(401).json({
      message: 'Need to specify correct type field (i.e. NEW_SUBSCRIPTION or RENEW_SUBSCRIPTION)'
    });
  }

  try {
    // $1: find user
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unknow user id' });
    } else if (!user.stripeId && req.body.source) {
      return res.status(401).json({ message: 'Need to specify user payment source' });
    }

    // $2: create stripe user for newly sign-up customer
    let stripeId = user.stripeId;
    if (!user.stripeId) {
      const email = user.email;
      const source = req.body.source;
      const customer = await stripe.customers.create({
        email: email,
        source: source
      });
      stripeId = customer.id;
    }

    // $3: create OR renew subscription
    let subscription;
    if (req.body.type === 'NEW_SUBSCRIPTION') {
      const subscription_ = new Subscription({});
      subscription = await subscription_.save();
    } else {
      subscription = await Subscription.findByIdAndUpdate();
      if (!subscription) throw Error;
    }

    // $4: create payment document
    const payment_ = new Payment({});
    const payment = await payment_.save();

    // $5: create stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeId,
      items: [{ plan: plan }]
    });

    // success response
    res.status(201).json({});
  } catch {
    // error response
    res.status(401).json({});
  }
};
