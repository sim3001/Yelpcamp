const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine','ejs');

app.get('/', (req,res)=>{
    res.render('landing');
});

app.get('/campgrounds', (req,res)=>{
    
});


app.listen(port, ()=>{
    console.log(`YelpCamp App running on Port ${port}`);
});