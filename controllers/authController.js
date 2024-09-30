const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) return res.status(401).send("User already exists");
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        try {
          let user = await userModel.create({
            email,
            password: hash,
            fullname,
          });
          let token = generateToken(user);
          res.cookie("token", token, { httpOnly: true });
          res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
          res.status(500).send(err.message);
        }
      });
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.loggedInUser = async (req, res) => {
  let { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(401).send("Incorrect password or email");
  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) return res.status(401).send("Incorrect password or email");
    let token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "Logged In " });
  });
};
