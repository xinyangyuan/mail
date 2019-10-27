const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const colors = require('colors');

const db = require('./config/database');
const errorHandler = require('./middlewares/error');

const stripeRoutes = require('./routes/stripe');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const addressRoutes = require('./routes/address');
const mailRoutes = require('./routes/mail');
const planRoutes = require('./routes/plan');
const paymentRoutes = require('./routes/payment');
const invoiceRoutes = require('./routes/invoice');
const subscriptionRoutes = require('./routes/subscription');

/*
 Instantiate express app
*/

const app = express();

/*
 Setup and connect to MongoDB Atlas databse
*/

db.connect();

/*
  Protect express app by helmet-js
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
      if (url === '/api/stripe/webhook') {
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
 stripe endpoints
*/

app.use('/api/stripe', stripeRoutes);

/*
 rest endpoints
*/

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

/*
 graphql endpoint 
*/

/*
 error handler
*/

app.use(errorHandler);

module.exports = app;
