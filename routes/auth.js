const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  register,
  login,
  getme,
  logout,
  forgotPassword,
  resetepassword,
  updateme,
  updatepasswd,
} = require("../controller/auth");

router.route("/register").post(register);
router.route("/login").post(login);
//router.route("/me").get(protect, getme);
router.get("/me", protect, getme);
router.route("/logout").get(logout);
router.route("/forgetpassword").put(forgotPassword);
router.route("/resetpassword/:token").put(resetepassword);
router.route("/updateme").post(protect, updateme);
router.route("/updatepasswd").post(protect, updatepasswd);

module.exports = router;
