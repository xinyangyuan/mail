const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Invoice = require('../models/invoice');
const Subscription = require('../models/subscription');

/*
  Service: create mail usage record
*/

exports.newMail = async (userId, mailId, session) => {
  // create session if none provided
  let isIsolateTransaction = false;
  if (!session) {
    isIsolateTransaction = true;
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // $1: find active subscription
    const subscription = await Subscription.findOne()
      .byUser(userId)
      .isActive()
      .populate({ path: 'planIds', match: { product: 'mail' } });
    if (!subscription) throw Error('User does not have active subscription');

    // $2: find current invoice
    let invoice = await Invoice.findOne()
      .byUser(userId)
      .currentPeriod();

    // $2-1: create invoice if none exists
    const now = new Date();
    if (!invoice) {
      // current year, month, and billing day
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = subscription.anchorDay;

      // current invoice startDate and endDate
      const startDate = new Date(year, month, day);
      const endDate = new Date(year, month + 1, day);
      const invoice_ = new Invoice({
        userId: mongoose.Types.ObjectId(userId),
        subscriptionId: mongoose.Types.ObjectId(subscription._id),
        startDate,
        endDate
      });
      invoice = await invoice_.save();
    }

    // check credit usage
    const mailCredit = subscription.planIds[0].flatCredit; // -1 => inf (pay-as-you-go-plan)
    const isOverage = mailCredit === -1 ? false : invoice.mailCount > mailCredit;
    if (isOverage && !subscription.isAllowOverage) {
      throw Error('User is out of mail credit');
    }

    // Start Transaction:
    // $3: update invoice
    const filter = { _id: invoice._id };
    const update = { $addToSet: { mailIds: mongoose.Types.ObjectId(mailId) } };
    const options = { session: session, runValidators: true };
    await Invoice.updateOne(filter, update, options);
    // if(!result) throw Error()

    // $4: update stripe
    const stripeItem = subscription.stripeItems.filter(
      item => item.product === 'mail' && item.type === 'metered'
    )[0].stripeId;

    await stripe.subscriptionItems.createUsageRecord(stripeItem, {
      quantity: 1,
      timestamp: Math.floor(now.getTime() / 1000), // stripe timestamp is in sec
      action: 'increment'
    });

    console.log('invoice updated');

    // Complete Transaction:
    if (isIsolateTransaction) {
      await session.commitTransaction();
      session.endSession();
    }
  } catch (error) {
    // Abort Transaction
    if (isIsolateTransaction) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

/*
  Service: create scan usage record
*/

exports.newScan = async (userId, mailId, session) => {
  // create session if none provided
  let isIsolateTransaction = false;
  if (!session) {
    isIsolateTransaction = true;
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // $1: find active subscription
    const subscription = await Subscription.findOne()
      .byUser(userId)
      .isActive()
      .populate({ path: 'planIds', match: { product: 'scan' } });
    if (!subscription) throw Error('User does not have active subscription');

    // $2: find current invoice
    let invoice = await Invoice.findOne()
      .byUser(userId)
      .currentPeriod();

    // $2-1: create invoice if none exists
    const now = new Date();
    if (!invoice) {
      // current year, month, and billing day
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = subscription.anchorDay;

      // current invoice startDate and endDate
      const startDate = new Date(year, month, day);
      const endDate = new Date(year, month + 1, day);
      const invoice_ = new Invoice({
        userId: mongoose.Types.ObjectId(userId),
        subscriptionId: mongoose.Types.ObjectId(subscription._id),
        startDate,
        endDate
      });
      invoice = await invoice_.save();
    }

    // check credit usage
    const scanCredit = subscription.planIds[0].flatCredit; // -1 => inf (pay-as-you-go-plan)
    const isOverage = scanCredit === -1 ? false : invoice.mailCount > scanCredit;
    if (isOverage && !subscription.isAllowOverage) {
      throw Error('User is out of scan credit');
    }

    // Start Transaction:
    // $3: update invoice
    const filter = { _id: invoice._id };
    const update = { $addToSet: { mailIds: mongoose.Types.ObjectId(mailId) } };
    const options = { session: session, runValidators: true };
    await Invoice.updateOne(filter, update, options);
    // if(!result) throw Error()

    // $4: update stripe
    const stripeItem = subscription.stripeItems.filter(
      item => item.product === 'scan' && item.type === 'metered'
    )[0].stripeId;

    await stripe.subscriptionItems.createUsageRecord(stripeItem, {
      quantity: 1,
      timestamp: Math.floor(now.getTime() / 1000), // stripe timestamp is in sec
      action: 'increment'
    });

    console.log('record updated');

    // Complete Transaction:
    if (isIsolateTransaction) {
      await session.commitTransaction();
      session.endSession();
    }
  } catch (error) {
    // Abort Transaction
    if (isIsolateTransaction) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};
