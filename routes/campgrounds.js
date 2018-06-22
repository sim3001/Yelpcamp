const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require('../middleware');

//INDEX - show all campgrounds
router.get("/", function(req, res){
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
     if(err){
         console.log(err);
     } else {
        res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser:req.user ,  page: 'campgrounds'});
     }
  });
});
//CREATE ROUTE /CAMPGROUNDS/
router.post("/", middleware.isLoggedIn, (req, res) => {
  //get data from form, add to campgrounds array
  const newCampground = req.body.campground;

  newCampground.author = {
    id: req.user._id,
    username: req.user.username
  };

  //Create a new campground and save to database
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      req.flash("error", err.message);
    } else {
      //redirect to campgrounds get page
      res.redirect("/campgrounds");
    }
  });
});

//Create route /campgrounds/new
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
  //Find campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        req.flash("error", err.message);
      } else {
        //Render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});
//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/campgrounds");
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

//Campground Destroy Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findOneAndRemove(req.params.id, err => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});




module.exports = router;
