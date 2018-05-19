const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine','ejs');

app.get('/', (req,res)=>{
    res.render('landing');
});

app.get('/campgrounds', (req,res)=>{
    var campgrounds = [
        {name:"Salmon Creek", image:"https://farm8.staticflickr.com/7677/17482091193_e0c121a102.jpg"},
        {name:"Granite Hill", image:"https://farm6.staticflickr.com/5452/16812275854_221a979b72.jpg"},
        {name:"Mountain Goat's Rest", image:"https://farm3.staticflickr.com/2947/15215548990_efc53d32b6.jpg"}
    ]
    res.render("campgrounds",{campgrounds : campgrounds});
});


app.listen(port, ()=>{
    console.log(`YelpCamp App running on Port ${port}`);
});