const Listing = require("../models/listing");
const mongoose = require("mongoose");

module.exports.index= async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
};

module.exports.new = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showlist = async(req,res)=>{
    let {id}= req.params;
    const objectId = new mongoose.Types.ObjectId(id.trim());
     // new mongoose.Types.ObjectId()
    const listing = await Listing.findById(objectId).populate("review").populate("owner"); 
    if(!listing){
        req.flash("error","listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createlist = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     console.log(req.user);
     newListing.owner= req.user._id;
     newListing.image= {url, filename};
     await newListing.save();
     res.redirect("/listings");
};

module.exports.updatelist = async(req, res)=>{
     let {id}= req.params;
     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
      let url = req.file.path;
    if( typeof req.file !== "undefined"){}
    let filename = req.file.filename;
     listing.image= {url, filename};
     await listing.save();
      newListing.image= {url, filename};
     req.flash("success");
     res.redirect(`/listings/${id}`);
};

module.exports.editlist = async(req, res)=>{
    let {id}= req.params;
    const objectId = new mongoose.Types.ObjectId(id.trim());
    const listing = await Listing.findById(objectId); 
    res.render("listings/edit.ejs",{listing});
};

module.exports.deletelist = async(req, res)=>{
    let {id}= req.params;
    let deleteListing= await Listing.findByIdAndDelete(id.trim());
    res.redirect("/listings");
};