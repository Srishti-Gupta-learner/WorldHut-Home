const Listing = require("../models/listing.js");
const User = require("../models/user.js");

module.exports.signupindex = (req,res)=>{
    res.render("user/signup");
};

module.exports.postsignup = async(req,res,next)=>{
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
};

module.exports.loginindex = (req,res)=>{
     res.render("user/login.ejs");
};

module.exports.postlogin = async(req, res) =>{
    req.flash("succss","You successfully Logged in!");
    let redirectUrl =  res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
    }
    req.flash("succss","You logged out!");
    res.redirect("/listings");
    })
};
