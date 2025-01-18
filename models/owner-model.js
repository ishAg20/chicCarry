const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  fullname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: "Invalid email format",
    },
  },
  password: { type: String, required: true },
  products: { type: Array, default: [] },
  gstin: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.length === 15,
      message: "GSTIN must be 15 characters",
    },
  },
});

module.exports = mongoose.model("owner", ownerSchema);
