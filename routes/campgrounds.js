const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');


router.get('/campgrounds', (req,res)=>{
    //Get all campgrounds from database
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{ campgrounds : allCampgrounds, currentUser: req.user });
        }
    })
});

router.post("/campgrounds", (req,res)=>{
    //get data from form, add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;

    const newCampground = {name: name, image: image, description: description};
    //Create a new campground and save to database
    Campground.create(newCampground, (err, newlyCreated)=>{
        if(err){
            console.log(err);
        } else{
            //redirect to campgrounds get page
            res.redirect("/campgrounds");
        }
    })
});

router.get("/campgrounds/new", (req,res)=>{
    res.render('campgrounds/new');
});

router.get("/campgrounds/:id", (req,res)=>{
    //Find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            //Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;