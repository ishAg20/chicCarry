const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController.js");
const { loggedInUser } = require("../controllers/authController.js");

router.post("/register", registerUser);

router.post("/login", loggedInUser);

module.exports = router;
