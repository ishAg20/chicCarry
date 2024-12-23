const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController.js");
const { loggedInUser } = require("../controllers/authController.js");
const { loggedOut } = require("../controllers/authController.js");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.post("/register", registerUser);

router.post("/login", loggedInUser);

router.get("/logout", loggedOut);

router.get("/shop", isLoggedIn, async (req, res) => {
  let products = await productModel.find();
  res.render("shop", { products });
});

router.get("/cart", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
  res.render("cart", { user });
});

router.get("/account", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.render("account", { user, message: req.query.message });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading account page.");
  }
});

module.exports = router;
