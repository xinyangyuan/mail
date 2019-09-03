const Plan = require('../models/plan');

/*
Function: get list of all plans [GET]
*/

exports.getPlanList = async (req, res) => {
  console.log('getPlanList is called');
  try {
    // projection:
    const projection = { usageStripeId: 0, baseStripeId: 0, __v: 0 };

    // $1: get address list
    const plans = await Plan.find({}, projection).lean();

    // success respons
    res.status(200).json({ message: 'success', planList: plans });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to get plan list' });
  }
};

/*
Function: get one plan by id [GET]
*/

exports.getPlan = async (req, res) => {
  console.log('getPlan is called');
  try {
    // projection:
    const projection = { usageStripeId: 0, baseStripeId: 0, __v: 0 };

    // $1: get address
    const plan = await Plan.findById(req.params.id, projection).lean();
    if (!plan) {
      return res.status(400).json({ message: 'Cannot find the plan' });
    }

    // success response
    res.status(200).json({ plan: plan });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to find the plan' });
  }
};

/*
  Function: create one new plan [POST]
*/

exports.createPlan = async (req, res) => {
  console.log('createPlan is called');
  try {
    // $1: save address [single sender can create multiple addresses]
    const plan_ = new Plan({
      name: req.body.name,
      description: req.body.description,
      product: req.body.product,
      interval: req.body.interval,
      flatRate: req.body.flatRate,

      isMetered: req.body.isMetered,
      unitPrice: req.body.unitPrice,
      unitLimit: req.body.unitLimit,
      flatCredit: req.body.flatCredit,

      isTiered: req.body.isTiered,
      tierUnitPrices: req.body.tierUnitPrices,
      tierUnitLimits: req.body.tierUnitLimits,

      usageStripeId: req.body.usageStripeId,
      baseStripeId: req.body.baseStripeId
    });
    const plan = await plan_.save();

    // success response
    res.status(201).json({ plan: plan });
  } catch (error) {
    console.log(error);
    // error response
    res.status(500).json({ message: error });
  }
};
