const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");  
const {saveRedirectUrl } = require("../logware.js");

const userControllers = require("../controllers/user");

router.route("/signup")
.get(userControllers.signupindex)  //signup
.post( wrapAsync(userControllers.postsignup));

// router.use(express.urlencoded({ extended: true }));
// router.use(express.json());


router.route("/login")        //login
.get(userControllers.loginindex)
.post( saveRedirectUrl,passport.authenticate('local', 
    { failureRedirect: '/login',
       failureFlash: true,
    }),userControllers.postlogin);

router.get("/logout",userControllers.logout);

module.exports = router;