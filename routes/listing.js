const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}= require("../schema.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const {isLoggedin}= require("../logware.js");


const validateListing= (req,res,next)=>{
      let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message.join(","));
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

//index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}));

//new route
router.get("/new", isLoggedin,(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",(async(req,res)=>{
    let {id}= req.params;
    const objectId = new mongoose.Types.ObjectId(id.trim());
     // new mongoose.Types.ObjectId()
const listing = await Listing.findById(objectId).populate("review"); 
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/",  isLoggedin,
    validateListing,
     wrapAsync(async(req,res,next)=>{
        const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//update route
router.put("/:id", isLoggedin,
    validateListing,
    wrapAsync(async(req, res)=>{
     let {id}= req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     res.redirect(`/listings/${id}`);
}));

//edit route
router.get("/:id/edit",  isLoggedin, wrapAsync(async(req, res)=>{
    let {id}= req.params;
    const objectId = new mongoose.Types.ObjectId(id.trim());
    const listing = await Listing.findById(objectId); 
    res.render("listings/edit.ejs",{listing});
}));

//delete route
router.delete("/:id", isLoggedin, wrapAsync(async(req, res)=>{
    let {id}= req.params;
    let deleteListing= await Listing.findByIdAndDelete(id.trim());
    res.redirect("/listings");
}));

module.exports = router;