const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  orders: { type: Array, default: [] },
  contact: Number,
  profilepic: String,
});

module.exports = mongoose.model("user", userSchema);
