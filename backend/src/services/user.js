const stripe = require('stripe')(process.env.STRIPE_KEY);
const User = require('../models/user');

/*
  Service: verify user sign-up code
*/

exports.senderSignupCodeVerify = code => {
  // sender signup code verification
  const now = new Date();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const secret = date.getTime() * process.env.SENDER_REGISTRY_SECRET_MUL;
  return secret === +code; // convert to number type then compare
};

/*
  Service: find a user by id
*/

exports.findUserById = id => {
  return User.findById(id);
};

/*
  Service: create stripe customer account for a user - need payment source
*/

exports.creteStripeCustomerAccount = (user, source) => {
  // stripe customer details
  const details = {
    email: user.email,
    name: user.fullName,
    source: source.id,
    metadata: { id: user._id.toString() }
  };

  // filter, options
  const filter = { _id: user._id };
  const options = { runValidators: true, new: true };

  // promise
  return stripe.customers
    .create(details, { idempotency_key: user._id.toString() + Date.now() })
    .then(customer => User.findOneAndUpdate(filter, { $set: { stripeId: customer.id } }, options));
};
