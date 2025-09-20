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
        // required: true,
    },
    image:{
        url: String,
        filename: String,
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
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: [ "mountains","Rooms","Trending", "Iconic-city","Beach","pools","Forests","Campaning","Farms", "Domes", "Island", "Hills", "Dinnerdate", "Religiouscity", "Hotels", "Tree-house", "Historic", "Houseboat"],
        required:true,
    },
      geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
         await Review.deleteMany(_id, {$in: listing.review });
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;