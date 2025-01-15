const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  label: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zip: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[1-9][0-9]{5}$/.test(value),
      message: "Invalid ZIP code format.",
    },
  },
});

const orderSchema = mongoose.Schema({
  orderId: String,
  total: {
    type: Number,
    required: true,
    min: [0, "Total amount must be non-negative"],
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const userSchema = mongoose.Schema({
  fullname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: "Invalid email format",
    },
  },
  password: { type: String, required: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  orders: [orderSchema],
  addresses: [addressSchema],
  contact: {
    type: Number,
    required: false,
    validate: {
      validator: (value) => value.toString().length === 10,
      message: "Contact number must be 10 digits",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
