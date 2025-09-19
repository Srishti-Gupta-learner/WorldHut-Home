const Listing =require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js")
const { listingSchema } = require("./schema.js");

module.exports.isLoggedin= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("you must login for this service");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl ){
        res.locals.redirectUrl= req.session.redirectUrl ;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
     let listing = await Listing.findById(id);
     if(!currUser && listing.owner.equals(res.locals.currUser._id)){
         req.flash("Error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
     }
     next();
}

module.exports.reviewAuthor = async(req,res,next)=>{
     let {id, reviewId}= req.params;
     let review = await Review.findById(reviewId);
     if(!currUser && review.author.equals(res.locals.currUser._id)){
         req.flash("Error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
     }
     next();
}

module.exports.validateListing= (req,res,next)=>{
      let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message.join(","));
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview= (req,res,next)=>{
      let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}
