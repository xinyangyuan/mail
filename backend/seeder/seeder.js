const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

const Plan = require('../src/models/plan');
const Address = require('../src/models/address');
const User = require('../src/models/user');
const Mail = require('../src/models/mail');
const Subscription = require('../src/models/subscription');
const Invoice = require('../src/models/invoice');
const Payment = require('../src/models/payment');

// Load env
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_ATLAS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const plans = JSON.parse(fs.readFileSync(`${__dirname}/_data/plans.json`, 'utf-8'));
const addresses = JSON.parse(fs.readFileSync(`${__dirname}/_data/addresses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const mails = JSON.parse(fs.readFileSync(`${__dirname}/_data/mails.json`, 'utf-8'));
const subscriptions = JSON.parse(fs.readFileSync(`${__dirname}/_data/subscriptions.json`, 'utf-8'));
const invoices = JSON.parse(fs.readFileSync(`${__dirname}/_data/invoices.json`, 'utf-8'));

// Initialize DB
const importData = async () => {
  try {
    await Plan.create(plans);
    await Address.create(addresses);
    await User.create(users);
    await Mail.create(mails);
    await Subscription.create(subscriptions);
    await Invoice.create(invoices);
    await Payment.create();
    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Reset DB
const deleteData = async () => {
  try {
    await Plan.deleteMany();
    await Address.deleteMany();
    await User.deleteMany();
    await Mail.deleteMany();
    await Subscription.deleteMany();
    await Invoice.deleteMany();
    await Payment.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
