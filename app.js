const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

mongoose.connect("mongodb://localhost:27017/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database Connected");
});

//SCHEMA Setup
const campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Campground = mongoose.model("Campground", campgroundsSchema);

app.get('/', (req,res)=>{
    res.render('landing');
});

app.get('/campgrounds', (req,res)=>{
    //Get all campgrounds from database
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds",{campgrounds : allCampgrounds});
        }
    })
    
});

app.post("/campgrounds", (req,res)=>{
    //get data from form, add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    //Create a new campground and save to database
    Campground.create(newCampground, (err, newlyCreated)=>{
        if(err){
            console.log(err);
        } else{
            console.log(newlyCreated);
            //redirect to campgrounds get page
            res.redirect("/campgrounds");
        }
    })
});

app.get("/campgrounds/new", (req,res)=>{
    res.render('new.ejs');
    
});


app.listen(port, ()=>{
    console.log(`YelpCamp App running on Port ${port}`);
});