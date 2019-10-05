const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
mongoose.set('useUnifiedTopology', true); // deprecation

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
app.use(cookieParser());

/*
 cors settings
*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

/*
 stripe publick key & webhook routes
*/

app.get('/api/stripe-pk', (_, res) => res.status(200).json({ pk: process.env.STRIPE_PUB_KEY }));
app.use('/api/stripe-webhook', stripeWebhookRoutes);

/*
 rest api routes
*/

app.use('/api/user', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);

/*
 graphql api route
*/

module.exports = app;
