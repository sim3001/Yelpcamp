const express = require('express');
const port = process.env.PORT || 3000;
var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

var campgrounds = [
    {name:"Salmon Creek", image:"https://farm8.staticflickr.com/7677/17482091193_e0c121a102.jpg"},
    {name:"Granite Hill", image:"https://farm6.staticflickr.com/5452/16812275854_221a979b72.jpg"},
    {name:"Mountain Goat's Rest", image:"https://farm3.staticflickr.com/2947/15215548990_efc53d32b6.jpg"}
];

app.get('/', (req,res)=>{
    res.render('landing');
});

app.get('/campgrounds', (req,res)=>{
    res.render("campgrounds",{campgrounds : campgrounds});
});

app.post("/campgrounds", (req,res)=>{
    //get data from form, add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    //redirect to campgrounds get page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req,res)=>{
    res.render('new.ejs');
    
});


app.listen(port, ()=>{
    console.log(`YelpCamp App running on Port ${port}`);
});