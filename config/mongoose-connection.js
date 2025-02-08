const mongoose = require("mongoose");

const uri =
  "mongodb+srv://agarwalishika2012:ishika123@cluster0.b80jk.mongodb.net/chicCarry?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
