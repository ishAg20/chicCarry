const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");

module.exports = async (req, res, next) => {
  if (!req.cookies.token) {
    req.flash("error", "You need to login first");
    return res.redirect("/");
  }
  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let owner = await ownerModel
      .findOne({ email: decoded.email })
      .select("-password");
    if (!owner) {
      req.flash("error", "owner not found, please log in again.");
      return res.redirect("/");
    }
    req.owner = owner;
    next();
  } catch (err) {
    req.flash("error", "Something went wrong!");
    return res.redirect("/");
  }
};
