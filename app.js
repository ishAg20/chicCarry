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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
require("dotenv").config();

app.use("/", index);
app.use("/owner", ownerRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(flash());

app.listen(3000);
