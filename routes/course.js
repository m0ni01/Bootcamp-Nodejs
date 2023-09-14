const express = require("express");
const course = require("../models/Course");
const advancedResult = require("../middleware/advancedResult");
const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controller/courses");

router
  .route("/")
  .get(
    advancedResult(course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
