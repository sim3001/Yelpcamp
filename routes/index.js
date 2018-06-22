const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Campground = require('../models/campground');
//Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

// show register form
router.get("/register", function (req, res) {
  res.render("register", {
    page: 'register'
  });
});

//Handle sign up logic
router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  if (req.body.adminCode === "adminpassword") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", `Welcome to YelpCamp ${user.username}`);
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login", {
    page: 'login'
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out");
  res.redirect("/campgrounds");
});

//User Profile
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/campgrounds");
    } else {
      Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/campgrounds");
        } else {
          res.render('users/show', {
            user: foundUser,
            campgrounds : campgrounds
          });
        }
      });
    }
  });
});

module.exports = router;