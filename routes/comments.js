const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//Comments new
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});
//Comments create
router.post("/", isLoggedIn, (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        //create new comments
        //connect new comments to campground
        //redirect to campground show page
        if (err) {
          console.log(err);
        } else {
          //add username and id to comments
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

//Comments Edit Route

router.get("/:comment_id/edit", (req,res)=>{
  Comment.findById(req.params.comment_id, (err, foundComment)=> {
    if(err){
      console.log(err);
    } else {
      res.render('comments/edit', { comment: foundComment, campgroundId: req.params.id });
    }
  });
});

//Update Comment Route
router.put("/:comment_id", (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
