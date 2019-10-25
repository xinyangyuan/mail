const mongoose = require('mongoose');

const createTransactionSession = async (...promises) => {
  // create mongoose transaction session
  const session = await mongoose.startSession();

  // attactch all db actions to session
  promises.forEach(promise => promise.session(session));

  // return session
  return session;
};

module.exports = { createTransactionSession };
