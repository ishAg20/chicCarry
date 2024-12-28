const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => value > 0,
      message: "Price must be greater than 0",
    },
  },
  image: { type: Buffer, required: true },
  bgcolor: { type: String, required: true },
  panelcolor: { type: String, required: true },
  textcolor: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  discount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("products", productSchema);
