const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      req.flash("error", "User already exists. Login!");
      return res.redirect("/");
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        try {
          let user = await userModel.create({
            email,
            password: hash,
            fullname,
          });
          let token = generateToken(user);
          res.cookie("token", token, { httpOnly: true });
          req.flash("success", "User registered successfully");
          res.redirect("/");
        } catch (err) {
          req.flash("error", "An error occurred during registration.");
          res.redirect("/");
        }
      });
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.loggedInUser = async (req, res) => {
  let { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    req.flash("error", "Incorrect password or email");
    return res.redirect("/");
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) {
      req.flash("error", "Incorrect password or email");
      return res.redirect("/");
    }
    let token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/shop");
  });
};

module.exports.loggedOut = (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully");
  res.redirect("/");
};
