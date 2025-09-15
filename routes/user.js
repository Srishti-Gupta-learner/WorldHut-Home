const express= require("express");
const router= express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");  
const {saveRedirectUrl } = require("../logware.js");

//signup
router.get("/signup",(req,res)=>{
    res.render("user/signup");
})

router.post("/signup", 
    wrapAsync(async(req,res,next)=>{
   try {
     let{username, email,password} = req.body;
    const newUser= new User({email, username});
    const registeredUser= await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("Welcome to WorldHut");
    res.redirect("/listings");
    });
   } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
   }
}));

//login
router.get("/login",(req,res)=>{
     res.render("user/login.ejs");
});

router.post('/login', saveRedirectUrl,
  passport.authenticate('local', 
    { failureRedirect: '/login',
       failureFlash: true,
    }),
   async(req, res) =>{
    req.flash("succss","You successfully Logged in!");
    let redirectUrl =  res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
    }
    req.flash("succss","You logged out!");
    res.redirect("/listings");
    })
});

module.exports = router;