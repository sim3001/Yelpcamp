const express = require('express'),
      port = process.env.PORT || 3000,
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground");


const app = express();

mongoose.connect("mongodb://localhost:27017/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database Connected");
});



app.get('/', (req,res)=>{
    res.render('landing');
});

app.get('/campgrounds', (req,res)=>{
    //Get all campgrounds from database
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render("index",{campgrounds : allCampgrounds});
        }
    })
});

app.post("/campgrounds", (req,res)=>{
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

app.get("/campgrounds/new", (req,res)=>{
    res.render('new.ejs');
});

app.get("/campgrounds/:id", (req,res)=>{
    //Find campground with provided ID
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){
            console.log(err);    
        } else {
            //Render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});


app.listen(port, ()=>{
    console.log(`YelpCamp App running on Port ${port}`);
});