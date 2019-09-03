const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const stripeWebhookRoutes = require('./routes/stripe-webhook');
const userRoutes = require('./routes/user');
const addressRoutes = require('./routes/address');
const mailRoutes = require('./routes/mail');
const planRoutes = require('./routes/plan');
const paymentRoutes = require('./routes/payment');
const subscriptionRoutes = require('./routes/subscription');

const app = express();

/*
 setup and connect to MongoDB Atlas databse
*/

mongoose.set('useNewUrlParser', true); // deprecation
mongoose.set('useFindAndModify', false); // deprecation
mongoose.set('useCreateIndex', true); // deprecation

mongoose
  .connect(process.env.MONGO_ATLAS)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection to database failed!');
  });

/*
 parse data stream to data object
*/

app.use(bodyParser.json()); // json type data
app.use(bodyParser.urlencoded({ extended: false })); // url encoded data

/*
 cors settings
*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

/*
 stripe webhook route
*/

app.use('/stripe-webhook', stripeWebhookRoutes);

/*
 api routes
*/

app.use('/api/user', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);

module.exports = app;
