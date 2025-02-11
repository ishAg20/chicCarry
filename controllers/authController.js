const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.redirect("/?error=User already exists. Please log in.");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = await userModel.create({
      email,
      fullname,
      password: hashedPassword,
    });

    let token = generateToken(newUser);
    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/?success=User registered successfully!");
  } catch (err) {
    console.error("Registration Error:", err);
    return res.redirect("/?error=An error occurred during registration.");
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
