const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


//Root Route
router.get('/', (req,res)=>{
    res.render('landing');
});

router.get('/register', (req,res)=>{
    res.render('register');
});

//Handle sign up logic
router.post('/register', (req,res)=>{
    const newUser =  new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, ()=>{
            res.redirect('/campgrounds');
        })
    });
});

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}) ,(req,res)=>{
});

router.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/campgrounds');
});


//Middleware to check if user is logged in
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect('/login');
    }
}

module.exports = router;