const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const router = express.Router();
const productModel = require("../models/product-model");

router.get("/", (req, res) => {
  try {
    res.render("index", {
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
