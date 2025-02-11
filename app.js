const express = require("express");
const app = express();
const ownerRouter = require("./routes/ownerRouter");
const usersRouter = require("./routes/usersRouter");
const accountRouter = require("./routes/accountRouter");
const productsRouter = require("./routes/productsRouter");
const index = require("./routes/index");
const expressSession = require("express-session");
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

// Session Middleware (Flash removed)
app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware to attach success/error messages from session to response locals
app.use((req, res, next) => {
  res.locals.success = req.session.success || "";
  res.locals.error = req.session.error || "";
  req.session.success = "";
  req.session.error = "";
  next();
});

// Routes setup
app.use("/", index);
app.use("/owner", ownerRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/users/account", accountRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
