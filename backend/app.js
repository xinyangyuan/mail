const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const addressRoutes = require('./routes/address');
const mailRoutes = require('./routes/mail');

const app = express();

/*
 setup and connect to MongoDB Atlas databse
*/

mongoose
  .connect(process.env.MONGO_ATLAS)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection to database failed!');
  });

mongoose.set('useFindAndModify', false);

/*
 parse data stream to data object
*/

app.use(bodyParser.json()); // jason type data
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
 api routes
*/

app.use('/api/user', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/mail', mailRoutes);
module.exports = app;
