const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}= require("../schema.js");

const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage});

const {isLoggedin}= require("../logware.js");

const listingController= require("../controllers/listing");

const validateListing= (req,res,next)=>{
      let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message.join(","));
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

router.route("/")
.get(wrapAsync(listingController.index)) //index route
.post(isLoggedin, 
    upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.createlist));  //create route

//new route
router.get("/new", isLoggedin,listingController.new);

router.route("/:id")
.get(wrapAsync(listingController.showlist))  //show route
.put(isLoggedin, 
    upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.updatelist))  //update route
.delete(isLoggedin, wrapAsync(listingController.deletelist));  //delete route

//edit route
router.get("/:id/edit",  isLoggedin, wrapAsync(listingController.editlist));

module.exports = router;