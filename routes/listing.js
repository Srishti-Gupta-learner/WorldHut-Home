const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage});

const {isLoggedin,isOwner,validateListing}= require("../logware.js");


const listingController= require("../controllers/listing");


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
.put(isLoggedin, isOwner,
    upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.updatelist))  //update route
.delete(isLoggedin, isOwner,wrapAsync(listingController.deletelist));  //delete route

//edit route
router.get("/:id/edit",  isLoggedin, isOwner,wrapAsync(listingController.editlist));

module.exports = router;