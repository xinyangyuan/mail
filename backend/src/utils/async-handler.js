const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

// const async = fn => (req, res, next) => {
//   // initialize mongoose transaction session
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   Promise.resolve(
//       fn(req, res, next)
//       ).catch(next);
// };
