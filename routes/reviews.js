const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedin}= require("../logware.js");

const reviewController= require("../controllers/review.js");

//review- post route
router.post("/",isLoggedin, validateReview, wrapAsync(reviewController.postreview));

//review delete route
router.delete("/:reviewId", wrapAsync(reviewController.deletereview));

module.exports= router;