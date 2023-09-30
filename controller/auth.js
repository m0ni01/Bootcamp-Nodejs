const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/users");
const asyncHandler = require("../middleware/asynchandler");
const sendemail = require("../utils/sendemail");
const crypto = require("crypto");

// @des         Register user
// @route       POST /api/v1/auth/register
// @access      Public

exports.register = asyncHandler(async (req, res, next) => {
  console.log(req);
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

// @des         LOGOUT
// @route       GET /api/v1/auth/logout
// @access      Public

exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).cookie("token", "none").json({});
});

// @des         Getting User info
// @route       GET /api/v1/auth/me
// @access      Private
exports.getme = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// @des         Update User email and name
// @route       GET /api/v1/auth/updateme
// @access      Private
exports.updateme = asyncHandler(async (req, res, next) => {
  const fields = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fields, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @des         Update Password
// @route       Post /api/v1/auth/updatepassword
// @access      Private

exports.updatepasswd = asyncHandler(async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  //if any field not provided
  if (!oldpassword || !newpassword) {
    return next(
      new ErrorResponse(
        "Please Provide both fields correctly newpassword and oldpassword",
        401
      )
    );
  }

  //getting user
  const user = await User.findById(req.user.id).select("+password");
  //ismatch = await user.matchPassword(req.body.oldpassword);
  const isMatch = await user.matchPassword(oldpassword);
  if (!isMatch) {
    return next(new ErrorResponse("Old Password does not match"));
  }
  user.password = newpassword;
  await user.save();
  res.status(200).json({ success: true, data: user });
});

// @des         Getting User info
// @route       GET /api/v1/auth/me
// @access      Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const token = user.getResetPasswordToken();
  console.log(token);
  await user.save({ validateBeforeSave: false });
  const url = `https://localhost.com/api/v1/auth/forgetpassword/${token}`;
  console.log(user.email);
  try {
    await sendemail({
      to: user.email,
      subject: "Reset Password",
      text: `Please Click on below link to rest you passowrd \n\n${url}`,
    });
    res.status(200).json({ success: true, data: "Email sent !" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(`Server error ${err}`, 500));
  }
});

// @des         Reset Password
// @route       PUT /api/v1/auth/resetpassoword/:token
// @access      Public
exports.resetepassword = asyncHandler(async (req, res, next) => {
  if (!req.params.token) {
    return next(new ErrorResponse("Please add token", 401));
  }

  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });
  console.log(token);
  console.log(user);

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 401));
  }
  if (!req.body.password) {
    return next(new ErrorResponse("Please Enter password", 401));
  }
  newpassword = req.body.password;
  console.log(newpassword);
  user.password = newpassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

//helper
//get token from modrom , and create cooke and send response

const sendTokenResponse = function (user, statusCode, res) {
  const token = user.signinJWTtoken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 30 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
