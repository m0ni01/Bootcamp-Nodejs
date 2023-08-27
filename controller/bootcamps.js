const ErrorResponse = require("../utils/ErrorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/asynchandler");
// @des         get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamp.length, data: bootcamp });
});
// @des         get single bootcamps
// @route       GET /api/v1/bootcamp/:id
// @access      Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Resource not found ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @des         create bootcamp
// @route       POST /api/v1/bootcamp
// @access      PRIVATE

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const createBootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: createBootcamp });
});

// @des         UPdate bootcamp
// @route       PUT /api/v1/bootcamp/:id
// @access      PRIVATE

exports.updateBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`Resource not found ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @des         delete bootcamps
// @route       DELETE /api/v1/bootcamp/:ID
// @access      PRIVATE

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Resource not found ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: [] });
});
