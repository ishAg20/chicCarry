const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");

router.post("/create", upload.single("image"), async (req, res) => {
  let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
  let product = await productModel.create({
    image: req.file.buffer,
    name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,
  });
  req.flash("success", "Product created successfully");
  res.redirect("/owner/admin");
});

router.post("/delete", async (req, res) => {
  let result = await productModel.deleteMany({});
  res.redirect("/owner/admin");
});

router.get("/addtocart/:id", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.id);
  await user.save();
  res.redirect("/users/cart");
});

module.exports = router;
