const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const advancedResult = require("../middleware/advancedResult");
const User = require("../models/users");

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/users");

//all routes will be protected
router.use(protect);
router.use(authorize("admin"));

//getting all users
router.route("/").get(advancedResult(User), getUsers);
//for single user
router.route("/:id").get(getUser);
//for creating user
router.route("/").post(createUser);
//updateing user
router.route("/:id").put(updateUser);
//deleting user
router.route("/:id").delete(deleteUser);
module.exports = router;
