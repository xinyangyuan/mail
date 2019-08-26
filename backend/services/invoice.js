const mongoose = require('mongoose');

const Invoice = require('../models/invoice');
const Subscription = require('../models/subscription');

exports.newMail = async (user, mail, session) => {
  // $1: find active subscription
  const subscription = await Subscription.findOne()
    .byUser(user._id)
    .isActive()
    .populate('plan_id');
  if (!subscription) throw Error('User does not have active subscription');

  // $2: find current invoice
  let invoice = await Invoice.findOne()
    .byUser(user_.id)
    .currentPeriod();

  // $2-1: create invoice if none exists
  if (!invoice) {
    const invoice_ = new Invoice({
      user_id: mongoose.Types.ObjectId(user._id),
      subscription_id: mongoose.Types.ObjectId(subscription._id),
      start_date: subscription.period_start_date,
      end_date: subscription.period_end_date
    });
    invoice = await invoice_.save();
  }

  // check credit usage
  const isMeteredPlan = subscription.metered_pan;
  let isOverage = false;
  if (!isMeteredPlan) {
    const scanCredit = subscription.plan_id.scan_credit;
    const scanUsage = inovice.total_scan;
    const allowOverage = user.flags.allow_overage;
    isOverage = scanUsage > scanCredit;
    if (isOverage && !allowOverage) throw Error('User is out of scan credit');
  }

  // $3: update invoice
  const filter = { _id: invoice._id };
  const update = { $addToSet: { mail_ids: mongoose.Types.ObjectId(mail._id) } };
  const options = { session: session, runValidators: true };
  invoice = invoice.updateOne(filter, update, options);
};

exports.newScan = async (user, mail, session) => {
  // $1: find active subscription
  const subscription = await Subscription.findOne()
    .byUser(user._id)
    .isActive()
    .populate('plan_id');
  if (!subscription) throw Error('User does not have active subscription');

  // $2: find current invoice
  let invoice = await Invoice.findOne()
    .byUser(user_.id)
    .currentPeriod();

  // $2-1: create invoice if none exists
  if (!invoice) {
    const invoice_ = new Invoice({
      user_id: mongoose.Types.ObjectId(user._id),
      subscription_id: mongoose.Types.ObjectId(subscription._id),
      start_date: subscription.period_start_date,
      end_date: subscription.period_end_date
    });
    invoice = await invoice_.save();
  }

  // check credit usage
  const isMeteredPlan = subscription.metered_pan;
  let isOverage = false;
  if (!isMeteredPlan) {
    const scanCredit = subscription.plan_id.scan_credit;
    const scanUsage = inovice.total_scan;
    const allowOverage = user.flags.allow_overage;
    isOverage = scanUsage > scanCredit;
    if (isOverage && !allowOverage) throw Error('User is out of scan credit');
  }

  // $3: update invoice
  const filter = { _id: invoice._id };
  const update = { $addToSet: { scan_ids: mongoose.Types.ObjectId(mail._id) } };
  const options = { session: session, runValidators: true };
  invoice = invoice.updateOne(filter, update, options);
};
