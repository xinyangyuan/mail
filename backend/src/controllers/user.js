const asyncHandler = require('../utils/async-handler');
const User = require('../models/user');

/* 
  @desc     Get a logged-in user's profile
  @route    [GET] /api/v1/user/self
  @access   Private
*/

exports.getSelf = asyncHandler(async (req, res) => {
  // $1: find user
  const user = await User.findById(req.userData.userId);

  // success response
  res.status(200).json({
    ok: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
});
