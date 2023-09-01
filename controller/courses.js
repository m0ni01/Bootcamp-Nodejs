const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asynchandler");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const { red } = require("colors");

// @des         get all courses
// @route       GET /api/v1/bootcamps/:boootcampId/courses
// @access      Public

module.exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId }).populate({
      path: "bootcamp",
      select: "",
    });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;
  res.status(200).json({ success: true, count: courses.length, Data: courses });
});

// @des         get single courses
// @route       GET /api/v1/courses/:courseID
// @access      Public
module.exports.getCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id).populate({
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
  let bootcamp = await Bootcamp.findById(req.params.bootcampId);
  req.body.bootcamp = req.params.bootcampId;

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found ${req.params.bootcampId}`, 404)
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
  if (!course) {
    return next(new ErrorResponse(`Course not found ${req.params.id}`, 404));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, count: course.length, Data: course });
});

// @des         Delete single courses
// @route       Delete /api/v1/courses/:id
// @access      Private
module.exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Course not found ${req.params.id}`, 404));
  }

  await course.deleteOne();

  res.status(200).json({ success: true, count: course.length, Data: course });
});
