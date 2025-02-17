const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const otpStore = new Map(); //Store OTPs temporarily
require("dotenv").config();

//nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.registerUser = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await userModel.create({
      email,
      fullname,
      password: hashedPassword,
    });

    // Generate token
    let token = generateToken(newUser);
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

module.exports.sendOTP = async (req, res) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const { email } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP for registration is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully! Please check your email.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send OTP. Please try again.",
    });
  }
};

module.exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, fullname, password } = req.body;
    const storedOTPData = otpStore.get(email);

    if (
      !storedOTPData ||
      storedOTPData.otp != otp ||
      Date.now() > storedOTPData.expiresAt
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Try again.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    let newUser = await userModel.create({
      email,
      fullname,
      password: hashedPassword,
    });

    otpStore.delete(email);
    let token = generateToken(newUser);
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration.",
    });
  }
};

module.exports.loggedInUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.redirect("/?error=Incorrect email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/?error=Incorrect email or password.");
    }

    let token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/users/products");
  } catch (error) {
    console.error("Login Error:", error);
    return res.redirect("/?error=An error occurred during login.");
  }
};

module.exports.loggedOut = (req, res) => {
  res.clearCookie("token");
  return res.redirect("/?success=Logged out successfully!");
};
