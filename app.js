const express = require("express"),
  port = process.env.PORT || 3000,
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  User = require("./models/user"),
  seedDB = require("./seeds");

// Requiring routes
const commentRoutes = require("./routes/comments");
const campgroundsRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

const app = express();

//seedDB(); //Seed DB

mongoose.connect("mongodb://localhost:27017/yelp_camp");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Database Connected");
});

//Passport Config
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
  })
);
//Setup Connect-flash
app.use(flash());

//Setup a local variable for momentJS to be used in templates
app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Local to pass current user into header and to pass flash variables into templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
// Router
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);
//Server
app.listen(port, () => {
  console.log(`YelpCamp App running on Port ${port}`);
});
