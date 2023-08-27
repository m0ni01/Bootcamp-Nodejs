const ErrorResponse = require("../utils/ErrorResponse");

const errorhandler = (err, req, res, next) => {
  console.log(err);
  let error = err;
  //Mongoose Bad Object
  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource not found ${err.value}`, 404);
  }
  //Duplication error
  if (err.code === 11000) {
    error = new ErrorResponse(`Duplicate values ${err.keyValue.name}`, 400);
  }

  //ValidationError
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(`${message}`, 400);
  }

  res.status(error.statuscode || 500).json({
    success: false,
    error: error.message || "Server unable to process request",
  });
};

module.exports = errorhandler;
