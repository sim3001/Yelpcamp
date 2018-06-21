//Middleware goes here
const Campground = require('../models/campground');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    //does user own the campground
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    //Redirect if not logged in
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    //does user own the campground
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash("error", "Something went wrong...");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    //Redirect if not logged in
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect("/login");
  }
};

module.exports = middlewareObj;
