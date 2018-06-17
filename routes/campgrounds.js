const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

router.get("/", (req, res) => {
  //Get all campgrounds from database
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user
      });
    }
  });
});
//CREATE ROUTE /CAMPGROUNDS/
router.post("/", isLoggedIn, (req, res) => {
  //get data from form, add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {
    name: name,
    image: image,
    description: description,
    author: author
  };

  //Create a new campground and save to database
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      //redirect to campgrounds get page
      res.redirect("/campgrounds");
    }
  });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
  //Find campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        //Render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});
//Edit Campground Route
router.get("/:id/edit", checkOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//Update Campground Route
router.put("/:id", checkOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

//Campground Destroy Route
router.delete("/:id", checkOwnership, (req, res) => {
  Campground.findOneAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

//Check if users owns the campground
function checkOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    //does user own the campground
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    //Redirect if not logged in
    res.redirect("back");
  }
}
module.exports = router;
