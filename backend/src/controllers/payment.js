const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Plan = require('../models/plan');
const Subscription = require('../models/subscription');
const Payment = require('../models/payment');
const User = require('../models/user');

const AddressService = require('../services/address');
const SubscriptionService = require('../services/subscription');

/*
  Controller: get payment list [GET]
*/

exports.getPaymentList = async (req, res, next) => {};

/*
  Controller: fetch single payment by id [GET]
*/

exports.getPayment = async (req, res, next) => {};
