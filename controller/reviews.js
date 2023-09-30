const Review = require("../models/reviews");
const Bootcamp = require("../models/Bootcamp");
const Users = require("../models/users");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asynchandler");

// @des         GET All Reviews
// @route       GET /api/v1/bootcamps/:boootcampId/reviews
// @access      Public

module.exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      Data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
// @des         GET Single Review
// @route       GET /api/v1/reviews/:id
// @access      Public

module.exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse("Review Not found", 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});
// @des         Create Review
// @route       POST /api/v1/bootcamps/:bootcampID/reviews/:id
// @access      pirvate only authenticated

module.exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  const review = await Review.create(req.body);
  res.status(200).json({
    success: true,
    data: review,
  });
});
// @des         Update Review
// @route       PUT /api/v1/bootcamps/:bootcampID/reviews/:id
// @access      pirvate only authenticated

module.exports.updateReview = asyncHandler(async (req, res, next) => {
  const { title, text, rating } = req.body;
  review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("Review not found", 404));
  }
  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorize to update this review", 401)
    );
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    { title: title, text: text, rating: rating },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @des         Delete Single Review
// @route       GET /api/v1/reviews/:id
// @access      Public

module.exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse("Review Not found", 404));
  }
  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorize to update this review", 401)
    );
  }
  await review.deleteOne();
  res.status(200).json({
    success: true,
    data: [],
  });
});
