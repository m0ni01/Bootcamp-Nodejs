const jwt = require("jsonwebtoken");
const asyncHandler = require("./asynchandler");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/users");

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //if token does not exist
  if (!token) {
    return next(new ErrorResponse("Please Enter authorization token ", 401));
  }
  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized", 401));
  }
});

exports.authorize = (...data) => {
  return (req, res, next) => {
    if (!data.includes(req.user.role)) {
      return next(new ErrorResponse("You dont have role", 401));
    }
    next();
  };
};
