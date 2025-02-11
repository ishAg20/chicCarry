const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const { error, success } = req.query;
    res.render("index", { error, success });
  } catch (error) {
    console.error("Error rendering index page:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
