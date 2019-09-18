const mongoose = require('mongoose');

const Subscription = require('../models/subscription');
const Payment = require('../models/payment');

const AddressService = require('../services/address');

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

/*
  Event Handler:
*/

exports.eventHandler = async (req, res) => {
  console.log('eventHandler is called');
  try {
    // event and event object
    const event = req.stripeEvent;
    const eventObj = event.data.object;

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        let invoice = eventObj;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      case 'customer.subscription.created':
        await handleCustomerSubscriptionCreated(eventObj);
        break;
      case 'customer.subscription.updated':
        await handleCustomerSubscriptionUpdated(eventObj);
        break;
      case 'customer.subscription.deleted':
        await handleCustomerSubscriptionDeleted(eventObj);
        break;
      default:
        return res.status(400).end();
    }
    // Received the event
    res.status(200).json({ received: true });
  } catch (error) {
    console.log(error);
  }
};

const handleInvoicePaymentSucceeded = async stripeInvoice => {
  console.log('handleInvoicePaymentSucceeded is called');

  // create session and  transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // stripeInoiveId, subscriptionId
    const subscriptionId = stripeInvoice.lines.data[0].metadata.id;
    const billingReason = stripeInvoice.billing_reason;

    // $1: find subscription
    let subscription;
    for (let i = 0; i < 3 && !subscription; i++) {
      subscription = await Subscription.findById(subscriptionId).populate('planIds');
      if (!subscription) await snooze(2000);
      if (!subscription && i === 2) throw Error('No subscription found');
    }

    // update
    let update;
    switch (billingReason) {
      case 'subscription_create':
        update = { $set: { status: 'ACTIVE', stripeId: stripeInvoice.subscription } };
        break;
      case 'subscription_cycle':
        // get plan and plan inerval in months
        const plan = subscription.planIds[0];
        const planInterval = plan.intervalInMonth;

        // new period start and end date
        const oldEndDate = subscription.periodEndDate;
        const periodStartDate = oldEndDate;
        const periodEndDate = new Date(oldEndDate.setMonth(oldEndDate.getMonth() + planInterval));

        // update
        update = { $set: { status: 'ACTIVE', periodStartDate, periodEndDate } };
        break;
      case 'subscription_update':
      case 'subscription_threshold':
      case 'manual':
      default:
        throw Error('Unknow billing reason');
    }

    // Start Transaction:
    // filter, options
    const filter = { _id: subscriptionId };
    const options = { session: session, runValidators: true };

    // $2: update subscription
    await Subscription.updateOne(filter, update, options);

    // $3: add user to address
    if (billingReason === 'subscription_create') {
      const { addressId, userId } = subscription.toObject();
      const mailboxNo = stripeInvoice.lines.data[0].metadata.mailboxNo;
      await AddressService.addReceiver(addressId, userId, mailboxNo, options.session);
    }

    // $4: create payment
    const payment_ = new Payment({
      userId: subscription.userId,
      subscriptionId: subscription._id,
      stripeId: stripeInvoice.payment_intent, // pi_xxx
      stripeInvoiceUrl: stripeInvoice.hosted_invoice_url,
      reason: stripeInvoice.billing_reason.toUpperCase(),
      amount: stripeInvoice.amount_paid,
      date: new Date(stripeInvoice.created * 1000) // unix timpstamp to date
    });
    await payment_.save(options);

    // Complete Transaction:
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    // Abort Transaction:
    await session.abortTransaction();
    session.endSession();
    // throw error
    throw error;
  }
};

const handleCustomerSubscriptionCreated = async stripeSubscription => {
  console.log('handleCustomerSubscriptionCreated is called');
  try {
    // subscriptionId, stripeItems
    const subscriptionId = stripeSubscription.metadata.id;
    const subscriptionItems = stripeSubscription.items.data;
    const stripeItems = subscriptionItems.map(item => {
      return { stripeId: item.id, product: item.metadata.product, type: item.metadata.type };
    });

    // update, options
    const update = { $set: { stripeItems: stripeItems } };
    const options = { runValidators: true };

    // $1: update subscription
    let subscription;
    for (let i = 0; i < 3 && !subscription; i++) {
      subscription = await Subscription.findByIdAndUpdate(subscriptionId, update, options);
      if (!subscription) await snooze(2000);
      if (!subscription && i === 2) throw Error('No subscription found');
    }
  } catch (error) {
    throw error;
  }
};

const handleCustomerSubscriptionUpdated = async subscription => {
  // Possible values are incomplete, incomplete_expired, trialing, active, past_due, canceled, or unpaid
};

const handleCustomerSubscriptionDeleted = async subscription => {
  // Possible values are incomplete, incomplete_expired, trialing, active, past_due, canceled, or unpaid
};
