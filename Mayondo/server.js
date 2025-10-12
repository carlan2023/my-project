//1. Dependecies
//JSON dependencies
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const moment = require("moment");

const multer = require("multer");
const methodOverride = require("method-override");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1694567891234.jpg
  },
});

const upload = multer({ storage: storage });

// Make upload available in routes
module.exports = { upload };

require("dotenv").config();
const UserModel = require("./models/userModel");

//import routes
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const usersRoutes = require("./routes/stockRoutes");

// const { console } = require("inspector");
//Instantiations
const app = express();
const port = 3000;

//Configurations
app.locals.moment = moment;
//Setting up Mongo connection
mongoose.connect(process.env.DATABASE, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
});

mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

// Setting view engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Middleware
// app.use(express.static("public"))
app.use(cors());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(express.urlencoded({ extended: true }));
//express session configs
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //One day
  })
);
//passport configs
app.use(passport.initialize());
app.use(passport.session());

//Authenticate with Passport local strategy
passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

//Routes
app.use("/", authRoutes);
app.use("/stock", stockRoutes);
app.use("/sales", salesRoutes);
app.use("/user", usersRoutes);

//Bootstrapping a server
app.listen(3200, () => console.log("Listening"));
