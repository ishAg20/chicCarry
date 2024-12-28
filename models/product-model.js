const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Buffer, required: true },
  bgcolor: { type: String },
  panelcolor: { type: String },
  textcolor: { type: String },
  createdAt: { type: Date, default: Date.now },
  discount: { type: Number, default: 0 },
});

module.exports = mongoose.model("products", productSchema);
