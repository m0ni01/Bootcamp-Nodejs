const advancedResults = require("../middleware/advancedResult");
const User = require("../models/users");
const Review = require("../models/reviews");
const { protect, authorize } = require("../middleware/auth");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controller/reviews");
const express = require("express");

const route = new express.Router({ mergeParams: true });

route
  .route("/")
  .get(
    advancedResults(Review, { path: "bootcamp", select: "name description" }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);
//getting review by id
route
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("admin", "user"), updateReview)
  .delete(protect, authorize("admin", "user"), deleteReview);
//creating review
module.exports = route;
