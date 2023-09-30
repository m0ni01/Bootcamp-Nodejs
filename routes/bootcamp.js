const express = require("express");
const { protect, authorize } = require("../middleware/auth");
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
const reviewrouter = require("./reviews");

//advanced searchmiddleware
const advancedResults = require("../middleware/advancedResult.js");
const Bootcamp = require("../models/Bootcamp.js");

//re-routing to courses
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewrouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "Courses"), getBootcamps)
  .post(protect, authorize("admin", "publisher"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("admin", "publisher"), updateBootcamps)
  .delete(protect, authorize("admin", "publisher"), deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router.route("/:id/photo").put(protect, uploadBootcampImg);

module.exports = router;
