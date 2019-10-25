const Plan = require('../models/plan');

/*
  Service: find plans
*/

exports.findPlans = filter => {
  return Plan.find(filter);
};
