const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require('../middleware');

//Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash("error", err.message);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});
//Comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        //create new comments
        //connect new comments to campground
        //redirect to campground show page
        if (err) {
          req.flash("error", "Something went wrong...");
          console.log(err);
        } else {
          //add username and id to comments
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment");
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

//Comments Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      req.flash("error", err.message);
    } else {
      res.render("comments/edit", {
        comment: foundComment,
        campgroundId: req.params.id
      });
    }
  });
});

//Update Comment Route
router.put("/:comment_id", middleware.checkCommentOwnership,(req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});
//Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership,(req, res) => {
  Comment.findOneAndRemove(req.params.comment_id, err => {
    if (err) {
      req.flash("error", "Something went wrong");
      res.redirect("back");
    } else {
      req.flash("success", "Successfully deleted comment");
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});



module.exports = router;
