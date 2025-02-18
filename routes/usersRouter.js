const express = require("express");
const router = express.Router();
require("dotenv").config();
const {
  registerUser,
  loggedInUser,
  loggedOut,
  sendOTP,
  verifyOTP,
} = require("../controllers/authController.js");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const nodemailer = require("nodemailer");

router.use(express.json());

router.post("/register", registerUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

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
      query = productModel.find().sort({
        discount: { $ifNull: ["$discount", "$price"] },
      });
    } else if (sortby === "pricehl") {
      query = productModel
        .find()
        .sort({
          discount: { $ifNull: ["$discount", "$price"] },
        })
        .sort({ discount: -1 });
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
    const discounts = user.cart.reduce((totalDiscount, product) => {
      if (product.discount && product.price > product.discount) {
        return totalDiscount + (product.price - product.discount);
      }
      return totalDiscount;
    }, 0);
    const platformFee = 20;
    const finalTotal = total - discounts + platformFee;
    const orderId = `ORD-${Date.now()}`;
    const newOrder = {
      orderId,
      total: finalTotal,
      items,
    };
    const orderedItems = user.cart.map((product) => {
      return `Product: ${product.name}, Price: Rs. ${product.price}, Quantity: 1`;
    });

    user.orders.push(newOrder);
    user.cart = [];
    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - ${orderId}`,
      text: `Dear ${
        user.fullname.split(" ")[0] || "Customer"
      },\n\nThank you for your order. Your order ID is ${orderId}.\nTotal: Rs. ${finalTotal}\n\nItems ordered:\n${orderedItems.join(
        "\n\n"
      )}\n\nWe will notify you once your order has been shipped.\n\nBest regards,\nThe chicCarry Team`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.render("account", {
      user,
      message:
        "Your order has been placed. Please check your email for confirmation.",
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("An error occurred during checkout.");
  }
});

module.exports = router;
