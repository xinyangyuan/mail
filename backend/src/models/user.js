const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*
  Schema:
*/

const userSchema = new mongoose.Schema(
  {
    name: {
      type: { first: { type: String }, last: { type: String } },
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    status: {
      type: String,
      enum: ['UNCONFIRMED', 'ACTIVE', 'BLOCKED'],
      default: 'UNCONFIRMED'
    },
    role: {
      type: String,
      enum: ['USER', 'SENDER'],
      required: true
    },
    stripeId: {
      type: String
    },
    paymentSource: {
      type: String
    }
  },
  { timestamps: true }
);

/*
  Virtual Attributes:
*/

userSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});

userSchema.virtual('isSender').get(function() {
  return this.role === 'SENDER';
});

userSchema.virtual('isCustomer').get(function() {
  return typeof this.stripeId !== 'undefined';
});

/*
  Middlewares:
*/

// userSchema.pre('save', async function(next) {
//   // saltRounds really mean cost factor, pick the cost according to the server setup
//   // https://security.stackexchange.com/questions/3959/recommended-of-iterations-when-using-pkbdf2-sha256/3993#3993
//   this.password = await bcrypt.hash(this.password, 10);
// });

/*
  Query helper:
*/

userSchema.query.byEmail = function(email) {
  return this.where({ email: email });
};

/*
  Plug-ins:
*/

// use unique validator plugin/middleware
userSchema.plugin(uniqueValidator);

// export mongoose model
module.exports = mongoose.model('User', userSchema, 'users');
