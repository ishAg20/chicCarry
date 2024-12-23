const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController.js");
const { loggedInUser } = require("../controllers/authController.js");
const { loggedOut } = require("../controllers/authController.js");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.post("/edit", isLoggedIn, async (req, res) => {
  try {
    const { fullname, email, contact, password } = req.body;
    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    await userModel.updateOne(
      { email: req.user.email },
      { fullname, email, contact, password }
    );

    res.redirect("/users/account?message=Details updated successfully");
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).send("Error updating details.");
  }
});

router.get("/edit", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.render("editDetails", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit page.");
  }
});

module.exports = router;
