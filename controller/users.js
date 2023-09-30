const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/users");
const asyncHandler = require("../middleware/asynchandler");
const advancedResults = require("../middleware/advancedResult");

// @des         GET ALL USERS
// @route       GET /api/v1/users/
// @access      PIRVATE/ADMIN
module.exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// @des         GET ALL USER
// @route       GET /api/v1/users/:id
// @access      PIRVATE/ADMIN
module.exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @des        Create User
// @route       Post /api/v1/user/
// @access      PIRVATE/ADMIN
module.exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// @des         Update User
// @route       PUT /api/v1/users/:id
// @access      PIRVATE/ADMIN
module.exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new ErrorResponse("user not found", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @des         DELETE USER
// @route       DELETE /api/v1/users/:id
// @access      PIRVATE/ADMIN
module.exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: [],
  });
});
