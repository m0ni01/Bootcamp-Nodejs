const express = require("express");
const course = require("../models/Course");
const advancedResult = require("../middleware/advancedResult");
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
  .post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
