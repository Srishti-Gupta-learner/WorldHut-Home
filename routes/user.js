const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");  
const {saveRedirectUrl } = require("../logware.js");
const User = require("../models/user");

const userControllers = require("../controllers/user");

router.route("/signup")
.get(userControllers.signupindex)  //signup
.post( wrapAsync(userControllers.postsignup));

router.route("/login")        //login
.get(userControllers.loginindex)
.post( (req, res, next) => saveRedirectUrl,
        passport.authenticate('local', 
        { failureRedirect: '/login',failureFlash: true,}),
        userControllers.postlogin);

router.get("/logout",userControllers.logout);

module.exports = router;