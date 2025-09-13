const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default:"https://unsplash.com/photos/purple-plums-on-a-branch-with-yellow-background-9X_MX6NL6xw",
       set:(v)=> v===""?"https://unsplash.com/photos/purple-plums-on-a-branch-with-yellow-background-9X_MX6NL6xw":v,
    },
    price:{
        type: Number,
    },
    location:{
        type: String,
        required:true,
    },
    country:{
        type: String,
        required:true,
    },
    review:[
       {
         type: Schema.Types.ObjectId,
         ref:"Review",
       }
    ]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
         await Review.deleteMany(_id, {$in: listing.review });
         
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;