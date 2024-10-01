const express = require("express");
const app = express();
const ownerRouter = require("./routes/ownerRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const index = require("./routes/index");
const expressSession = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose-connection");
require("dotenv").config();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");

// Session and Flash middleware
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(flash());

// Middleware to make flash messages accessible in templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes setup
app.use("/", index);
app.use("/owner", ownerRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
