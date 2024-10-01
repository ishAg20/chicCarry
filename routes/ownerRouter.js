const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    let owner = await ownerModel.find();
    if (owner.length > 0) {
      return res
        .status(503)
        .send("You do not have permission to create new owner");
    }
    let { fullname, email, password } = req.body;
    let createdOwner = await ownerModel.create({
      fullname,
      email,
      password,
    });
    res.status(201).send(createdOwner);
  });
}

router.get("/admin", (req, res) => {
  let success = req.flash("success");
  res.render("admin", { success });
});

router.get("/createproduct", async (req, res) => {
  let products = await productModel.find();
  res.render("createproducts", { products });
});

module.exports = router;
