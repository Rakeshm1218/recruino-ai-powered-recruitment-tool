const express = require("express");
const {
  register,
  login,
  getUser,
  refresh,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", protect, getUser);
router.post("/refresh", refresh);

module.exports = router;
