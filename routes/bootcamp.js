const express = require("express");
const router = express.Router();

//bootcamps
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamps,
  deleteBootcamp,
  getBootcampInRadius,
} = require("../controller/bootcamps.js");

//router of courses
const courseRouter = require("./course.js");

//re-routing to courses
router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamps)
  .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

module.exports = router;
