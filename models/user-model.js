const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  zip: String,
});

const orderSchema = mongoose.Schema({
  orderId: String,
  total: Number,
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const userSchema = mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  orders: [orderSchema],
  addresses: [addressSchema],
  contact: { type: Number, required: false },
});

module.exports = mongoose.model("user", userSchema);
