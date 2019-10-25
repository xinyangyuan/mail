const asyncHandler = require('../utils/async-handler');

const Plan = require('../models/plan');
const ErrorResponse = require('../utils/error-response');

/* 
  @desc     Get all plans
  @route    [GET] /api/v1/plan
  @access   Public
*/

exports.getPlans = asyncHandler(async (req, res) => {
  // projection:
  const projection = { usageStripeId: 0, baseStripeId: 0, __v: 0 };

  // $1: get address list
  const plans = await Plan.find({}, projection).lean();

  // success respons
  res.status(200).json({ ok: true, data: { plans } });
});

/* 
  @desc     Get one plan by id
  @route    [GET] /api/v1/plan/:id
  @access   Public
*/

exports.getPlan = asyncHandler(async (req, res, next) => {
  // projection:
  const projection = { usageStripeId: 0, baseStripeId: 0, __v: 0 };

  // $1: get address
  const plan = await Plan.findById(req.params.id, projection).lean();
  if (!plan) {
    return next(new ErrorResponse('Unknow plan', 404));
  }

  // success response
  res.status(200).json({ ok: true, data: { plan } });
});

/* 
  @desc     Create new plan
  @route    [POST] /api/v1/plan
  @access   Private - ADMIN
*/

exports.createPlan = asyncHandler(async (req, res) => {
  // plan
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
  res.status(201).json({ ok: true, data: { plan } });
});

/* 
  @desc     Update a plan
  @route    [PATCH] /api/v1/plan/:id
  @access   Private - ADMIN
*/

exports.updatePlan = (req, res, next) => {
  res.status(200).json({ ok: true });
};

/* 
  @desc     Delete a plan
  @route    [DEL] /api/v1/plan
  @access   Private - ADMIN
*/

exports.deletePlan = (req, res, next) => {
  res.status(200).json({ ok: true });
};
