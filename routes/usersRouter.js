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

router.get("/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");
    res.render("cart", { user });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).send("An error occurred while fetching the cart.");
  }
});
router.post("/cart/product/delete/:index", isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.splice(req.params.index, 1);
    await user.save();
    res.redirect("/users/cart?message=Product deleted successfully");
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).send("Internal server error");
  }
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

router.get("/products", isLoggedIn, async (req, res) => {
  const sortby = req.query.sortby || "newest";
  try {
    let query;
    if (sortby === "pricelh") {
      query = productModel.find().sort({ price: 1 });
    } else if (sortby === "pricehl") {
      query = productModel.find().sort({ price: -1 });
    } else if (sortby === "newest") {
      query = productModel.find().sort({ createdAt: -1 });
    } else {
      query = productModel.find();
    }
    const products = await query;
    res.render("shop", { products, sortby });
  } catch (err) {
    console.error("Detailed error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    res.status(500).send("Server Error");
  }
});

router.get("/checkout", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");
    if (!user) {
      return res.status(404).send("User not found.");
    }
    if (user.cart.length === 0) {
      return res
        .status(400)
        .send("Your cart is empty. Please add items to proceed.");
    }
    let total = 0;
    const items = user.cart.map((product) => {
      total += product.price;
      return { product: product._id, quantity: 1 };
    });

    const discounts = user.cart.reduce(
      (totalDiscount, product) => totalDiscount + (product.discount || 0),
      0
    );
    const platformFee = 20;
    const finalTotal = total - discounts + platformFee;
    const orderId = `ORD-${Date.now()}`;
    const newOrder = {
      orderId,
      total: finalTotal,
      items,
    };
    user.orders.push(newOrder);
    user.cart = [];
    await user.save();

    res.render("account", {
      user,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("An error occurred during checkout.");
  }
});

module.exports = router;
