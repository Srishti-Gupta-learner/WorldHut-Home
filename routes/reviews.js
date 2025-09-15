const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema}= require("../schema.js");

const reviewController= require("../controllers/review.js");

const validateReview= (req,res,next)=>{
      let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

//review- post route
router.post("/",validateReview, wrapAsync(reviewController.postreview));

//review delete route
router.delete("/:reviewId", wrapAsync(reviewController.deletereview));

module.exports= router;