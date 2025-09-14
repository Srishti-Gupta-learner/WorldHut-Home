const express= require("express");
const router= express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");

router.get("/signup",(req,res)=>{
    res.render("user/signup");
})

router.post("/signup", 
    wrapAsync(async(req,res)=>{
   try {
     let{username, email,password} = req.body;
    const newUser= new User({email, username});
    const registeredUser= await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("Welcome to WorldHut");
    res.redirect("/listings");
   } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
   }
}));

router.get("/login",(req,res)=>{
     res.render("user/login.ejs");
});

router.post('/login', 
  passport.authenticate('local', 
    { failureRedirect: '/login',
       failureFlash: true,
    }),
   async(req, res) =>{
    res.flash("You successfully Login!");
    res.redirect('/listings');
  });

module.exports = router;