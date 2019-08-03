const mongoose = require('mongoose');

const User = require('../models/user');

//  Function: send greeting mail to newly signed-up user

const updateUserAddress = async (req, res) => {
  console.log('updateUserAddress hook is called');

  // prepare the update
  const update = {
    $set: { address: mongoose.Types.ObjectId(req.fetchedAddress._id) }
  };

  // async function: update user address field
  try {
    await User.findByIdAndUpdate(req.userData.userId, update, { runValidators: true });
  } catch {
    console.log('Failed to add address to user account!');
  }
};

/*
  (Post)-Hook: update user document's address field
*/

module.exports = updateUserAddress;
