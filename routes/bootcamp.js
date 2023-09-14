const express = require("express");
const { protect } = require("../middleware/auth");
const router = express.Router();

//bootcamps
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamps,
  deleteBootcamp,
  getBootcampInRadius,
  uploadBootcampImg,
} = require("../controller/bootcamps.js");

//router of courses
const courseRouter = require("./course.js");

//advanced searchmiddleware
const advancedResults = require("../middleware/advancedResult.js");
const Bootcamp = require("../models/Bootcamp.js");

//re-routing to courses
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "Courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamps)
  .delete(protect, deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router.route("/:id/photo").put(protect, uploadBootcampImg);

module.exports = router;
