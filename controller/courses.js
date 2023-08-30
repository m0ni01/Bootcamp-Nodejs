const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asynchandler");
const Course = require("../models/Course");

// @des         get all courses
// @route       GET /api/v1/bootcamps/:boootcampId/courses
// @access      Public

module.exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId }).populate({
      path: "bootcamp",
      select: "name description",
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
