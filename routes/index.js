const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const router = express.Router();
const productModel = require("../models/product-model");

router.get("/", (req, res) => {
  res.render("index", {
    error: req.flash("error"),
    success: req.flash("success"),
  });
});

module.exports = router;
