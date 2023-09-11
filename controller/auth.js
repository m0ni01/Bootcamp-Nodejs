const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/users");
const asyncHandler = require("../middleware/asynchandler");

// @des         Register user
// @route       POST /api/v1/auth/register
// @access      Public

exports.register = asyncHandler(async (req, res, next) => {
  console.log(req);
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  const token = user.signinJWTtoken();
  res.status(200).json({ success: true, token });
});

// @des         login user
// @route       POST /api/v1/auth/login
// @access      Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please Enter Valid Email and Password"));
  }
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    return next(new ErrorResponse("Invalid creditendials !", "401"));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid creditendials !", "401"));
  }
  const token = user.signinJWTtoken();
  res.status(200).json({ success: true, login: "passed" });
});
