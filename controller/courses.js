const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asynchandler");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const { red } = require("colors");

// @des         get all courses
// @route       GET /api/v1/bootcamps/:boootcampId/courses
// @access      Public

module.exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const course = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      Data: course,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @des         get single courses
// @route       GET /api/v1/courses/:courseID
// @access      Public
module.exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(new ErrorResponse("resourse not found", 200));
  }

  res.status(200).json({ success: true, count: course.length, Data: course });
});

// @des         Post single courses
// @route       POST /api/v1/bootcamp/:bootcampId/courses
// @access      Private
module.exports.addCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = bootcamp.user;

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found ${req.params.bootcampId}`, 404)
    );
  }

  //making sure user id owner of bootcamp
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse("Not authorized to add course to this bootcamp", 401)
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({ success: true, count: course.length, Data: course });
});

// @des         Update single courses
// @route       POST /api/v1/courses/:id
// @access      Private
module.exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  //checking if course exits
  if (!course) {
    return next(new ErrorResponse(`Course not found ${req.params.id}`, 404));
  }
  //checking owner of course
  if (req.user.id !== course.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse("Not authorized to Update course to this bootcamp", 401)
    );
  }
  //updating course
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  //sending request
  res.status(200).json({ success: true, count: course.length, Data: course });
});

// @des         Delete single courses
// @route       Delete /api/v1/courses/:id
// @access      Private
module.exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Course not found ${req.params.id}`, 404));
  }
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized to delete this course!", 401)
    );
  }

  await course.deleteOne();

  res.status(200).json({ success: true, count: course.length, Data: course });
});
