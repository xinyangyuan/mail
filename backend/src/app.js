const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

const stripeWebhookRoutes = require('./routes/stripe-webhook');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const addressRoutes = require('./routes/address');
const mailRoutes = require('./routes/mail');
const planRoutes = require('./routes/plan');
const paymentRoutes = require('./routes/payment');
const subscriptionRoutes = require('./routes/subscription');

const Invoice = require('./models/invoice');

const app = express();

/*
 setup and connect to MongoDB Atlas databse
*/

connectDB();

/*
  protect express app by helmet-js
*/

app.use(helmet({ hsts: false }));

/*
  Dev logger
*/

process.env.NODE_ENV === 'development' && app.use(morgan('dev'));

/*
  parse data stream to data object
*/

app.use(cookieParser()); // cookie
app.use(bodyParser.urlencoded({ extended: false })); // url encoded data
app.use(
  bodyParser.json({
    verify: function(req, res, buf) {
      const url = req.originalUrl;
      if (url === '/api/stripe-webhook') {
        req.rawBody = buf.toString(); // stripe requires raw
      }
    }
  })
);

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

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);

/*
 graphql api route
*/

/*
 error handler
*/

app.use(errorHandler);

module.exports = app;
