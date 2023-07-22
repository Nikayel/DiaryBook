const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

// config
dotenv.config({ path: "./config/config.env" });

// passport config
require("./config/passport")(passport);
connectDB();

const app = express();

// Logging using morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Express session middleware
app.use(
  session({
    secret: "hiSecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware (make sure this comes after the session middleware)
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

app.engine(
  ".hbs",
  exphbs.engine({ defaultLayout: "main", extname: ".hbs" })
);
app.set("view engine", ".hbs");

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server running on port 3000"));
