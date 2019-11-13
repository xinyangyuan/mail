const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Hash password
const hash = password => {
  return bcrypt.hashSync(password, 10);
};

// Encrypt s3 file directory
const encrypt = string => {
  let iv = crypto.randomBytes(16); // For AES, this is always 16
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Stripe
const createStripeCustomer = async users => {};

const createStripeSubscription = async (subscriptions, invoices) => {};

module.exports = { hash, encrypt };
