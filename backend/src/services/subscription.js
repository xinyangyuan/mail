const mongoose = require('mongoose');

const Plan = require('../models/plan');
const Subscription = require('../models/subscription');

/*
  New Subscription:
*/

exports.newSubscription = async (userId, planIds, addressId, session = undefined) => {
  // options
  const options = session ? { session: session } : {};

  try {
    // $1: find plan
    const filter = { _id: { $in: planIds } };
    const plans = await Plan.find(filter);
    if (!plans.length) throw Error('Unknow plans');
    if (plans.length !== planIds.length) throw Error(`Only can find ${plans}`);

    // validate all plans should have same interval
    if (!plans.map(plan => plan.intervalInMonth).every((value, idx, array) => value === array[0])) {
      throw Error('Selected plans have different billing intervals');
    }

    // caclculate period end date
    const plan = plans[0]; // select an arbitrary plan
    const periodInMonth = plan.intervalInMonth;
    const startDate = new Date();
    const periodEndDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + periodInMonth,
      startDate.getDate() + 1
    );

    //  $1: create subscription
    const subscription_ = new Subscription({
      planIds,
      userId,
      addressId,
      startDate: startDate,
      periodEndDate: periodEndDate
    });
    subscription = await subscription_.save(options);

    // return
    return subscription;
  } catch (error) {
    throw error;
  }
};
