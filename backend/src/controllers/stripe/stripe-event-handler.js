const mongoose = require("mongoose");
const snooze = require("../../utils/snooze");

const Payment = require("../../models/payment");
const Subscription = require("../../models/subscription");

const addressService = require("../../services/address");
const subscriptionService = require("../../services/subscription");

/*
  Class: stripe event handler
*/

class StripeEventHandler {
  // Attributes
  // eventType;
  // eventObject;

  // Constructor
  constructor(event) {
    this.eventType = event.type;
    this.eventObject = event.data.object;
    this.handle = this._genereateHandler();
  }

  /*
    Private method: generate handler functio
  */

  _genereateHandler() {
    switch (this.eventType) {
      case "invoice.payment_succeeded":
        return this.handleInvoicePaymentSucceeded;
      case "customer.subscription.created":
        return this.handleCustomerSubscriptionCreated;
      case "customer.subscription.updated":
        return this.handleCustomerSubscriptionUpdated;
      case "customer.subscription.deleted":
        return this.handleCustomerSubscriptionDeleted;
      default:
        return this.handleUnspecifiedEvent; // automatically return success result
    }
  }

  /*
    Method: handle invoice payment succeeded event
  */

  async handleInvoicePaymentSucceeded() {
    const invoice = this.eventObject;
    const billingReason = invoice.billing_reason;
    const subscriptionId = invoice.lines.data[0].metadata.id;

    // $1: find subscription
    let subscription;
    for (let i = 0; i < 3 && !subscription; i++) {
      subscription = await Subscription.findById(subscriptionId);
      if (!subscription) await snooze(2000);
      if (!subscription && i === 2)
        return { ok: false, message: "No subscription found" };
    }

    // handle bussiness logic - new subscription  OR renew subscription
    let transaction;
    billingReason === "subscription_create" &&
      (transaction = activateSubscription);
    billingReason === "subscription_cycle" && (transaction = renewSubscription);
    if (!transaction) {
      // other possible reasons: 'subscription_update', 'subscription_threshold', 'manual'
      return {
        ok: true,
        message: "Unhandled due to unspecified billing reasons",
      };
    }

    // $2: transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // start transction
      const result = await transaction();
      // commit transaction
      await session.commitTransaction();
      session.endSession();
      // return
      return result;
    } catch (error) {
      // abort transaction
      await session.abortTransaction();
      session.endSession();
      return { ok: false, message: error.stack };
    }

    // case 1: new subscription
    async function activateSubscription(session) {
      // - subscription update: status and stripeId
      const subscription = await subscriptionService.activateSubscription(
        subscriptionId,
        session
      );

      // - address update: add user to address
      const { userId, addressId } = subscription;
      const mailboxNo = invoice.lines.data[0].metadata.mailboxNo;
      const address = await addressService.addReceiver(
        addressId,
        userId,
        mailboxNo,
        session
      );

      // - payment: create payment document
      const payment = await new Payment({
        userId: subscription.userId,
        subscriptionId: subscription._id,
        stripeId: invoice.payment_intent, // pi_xxx
        stripeInvoiceUrl: invoice.hosted_invoice_url,
        reason: invoice.billing_reason.toUpperCase(),
        amount: invoice.amount_paid,
        date: new Date(invoice.created * 1000),
      }).save();

      // returns
      if (address && subscription && payment)
        return { ok: true, message: "Activate subscription" };
      else return { ok: false, message: "Unable to activate subscription" };
    }

    // case 2: reccurent payment
    async function renewSubscription(session) {
      // - subscription update: billing period
      const subscription = await subscriptionService.renewSubscription(
        subscriptionId,
        session
      );

      // - payment: crate payment document
      const payment = await new Payment({
        userId: subscription.userId,
        subscriptionId: subscription._id,
        stripeId: invoice.payment_intent, // pi_xxx
        stripeInvoiceUrl: invoice.hosted_invoice_url,
        reason: invoice.billing_reason.toUpperCase(),
        amount: invoice.amount_paid,
        date: new Date(invoice.created * 1000),
      }).save();

      // returns
      if (subscription && payment)
        return { ok: true, message: "Renew subscription" };
      else return { ok: false, message: "Unable to renew subscription" };
    }
  }

  /*
    Method: handle subcription created event
  */

  async handleCustomerSubscriptionCreated() {
    // subscriptionId, stripeId, stripeItems
    const stripeSubscription = this.eventObject;
    const subscriptionId = stripeSubscription.metadata.id;
    const [stripeId, subscriptionItems] = [
      stripeSubscription.id,
      stripeSubscription.items.data,
    ];
    const stripeItems = subscriptionItems.map((item) => {
      return {
        stripeId: item.id,
        product: item.metadata.product,
        type: item.metadata.type,
      };
    });

    // update, options
    const update = { $set: { stripeItems, stripeId } };
    const options = { runValidators: true, new: true };

    // $1: update subscription
    let subscription;
    for (let i = 0; i < 3 && !subscription; i++) {
      subscription = await Subscription.findByIdAndUpdate(
        subscriptionId,
        update,
        options
      );
      if (!subscription) await snooze(2000);
      if (!subscription && i === 2)
        return { ok: false, message: "Unable to update subscription" };
    }

    // return
    return {
      ok: true,
      message: `Subscription ${subscriptionId} updated sucessfully`,
    };
  }

  /*
    Method: handle subcription updated event
  */

  async handleCustomerSubscriptionUpdated() {
    // subscriptionId, status
    const stripeSubscription = this.eventObject;
    const subscriptionId = stripeSubscription.metadata.id;
    const status = stripeSubscription.status;

    // update subscription - handle status transitioned to incomplete_expired OR past_due
    if (status === "incomplete_expired" || status === "past_due") {
      // status log
      const event = `[Status] transition to ${status.toUpperCase()}`;
      const reason = `Stripe webhook triger event change`;
      const statusLog = { event, reason };

      // $1: update subscription status
      const subscription = await subscriptionService.updateSubscriptionStatus(
        subscriptionId,
        status.toUpperCase(),
        statusLog
      );

      // return
      if (subscription)
        return {
          ok: true,
          message: `Subscription ${subscriptionId} status changes to ${status}`,
        };
      else
        return {
          ok: false,
          message: `Subscription ${subscriptionId} failed to update ${status}`,
        };
    } else {
      return {
        ok: true,
        message: "Unhandled due to unspecified subscription status update",
      };
    }
  }

  /*
    Method: handle subcription deleted event
  */

  async handleCustomerSubscriptionDeleted() {
    // subscriptionId
    const stripeSubscription = this.eventObject;
    const subscriptionId = stripeSubscription.metadata.id;

    // status log
    const event = `[Status] transition to CANCELED`;
    const reason = `Stripe webhook triger event change`;
    const statusLog = { event, reason };

    // $1: update subscription status to cancel
    const status = "CANCELED";
    const subscription = await subscriptionService.updateSubscriptionStatus(
      subscriptionId,
      status,
      statusLog
    );

    // $2 remove user from address TODO: bind two asynchronous using transactions
    const { addressId, userId } = subscription;
    await addressService.removeReceiver(addressId, userId);

    // return
    if (subscription)
      return {
        ok: true,
        message: `Subscription ${subscriptionId} status changes to ${status}`,
      };
    else
      return {
        ok: false,
        message: `Subscription ${subscriptionId} failed to update ${status}`,
      };
  }

  /*
    Method: handle remaining un-specified events [AUTOMATICALLY SUCCESS RESPONSE]
  */

  handleUnspecifiedEvent() {
    return Promise.resolve({ ok: true, message: "Unspecified event" });
  }
}

module.exports = StripeEventHandler;
