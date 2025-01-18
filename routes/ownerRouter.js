const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const productModel = require("../models/product-model");
const ownerLoggedIn = require("../middlewares/ownerLoggedIn");
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
  res.render("owner-login");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const owner = await ownerModel.findOne({ email });
  if (!owner) {
    return res.redirect("/");
  }
  bcrypt.compare(password, owner.password, (err, result) => {
    if (!result) {
      return res.redirect("/");
    }
    let token = generateToken(owner);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/owners/admin");
  });
});

router.get("/admin", async (req, res) => {
  let success = req.flash("success");
  let products = await productModel.find();
  res.render("admin", { success, products });
});

router.get("/createproduct", async (req, res) => {
  let products = await productModel.find();
  res.render("createproducts", { products });
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully");
  res.redirect("/");
});

module.exports = router;
