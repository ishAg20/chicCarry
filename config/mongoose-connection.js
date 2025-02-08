require("dotenv").config(); // Load environment variables

const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI; // Get URI from .env

if (!uri) {
  console.error("❌ MONGODB_URI is missing in .env file!");
  process.exit(1); // Stop execution if URI is missing
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
