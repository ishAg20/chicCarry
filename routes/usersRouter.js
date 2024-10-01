const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController.js");
const { loggedInUser } = require("../controllers/authController.js");
const { loggedOut } = require("../controllers/authController.js");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.post("/register", registerUser);

router.post("/login", loggedInUser);

router.get("/logout", loggedOut);

module.exports = router;
