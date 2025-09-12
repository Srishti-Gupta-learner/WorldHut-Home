const express= require("express");
const app = express();
const Listing = require("./models/listing.js");
const path= require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const {listingSchema, reviewSchema}= require("./schema.js");
const session= require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const localStratagey = require("passport-local");   
const User = require("./models/user.js");

// const userRouter = require("./routes/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/travel";

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.set('views', 'views'); // This sets the views directory

const sessionOption= {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7*24*60*1000,
        maxage: 7*24*60*1000,
        httpOnly: true,
    }
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratagey(User.authenticate));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    next();
})

app.get("/listings/demouser",async(req,res)=>{
    const demouser= new User({
        email:"drtsrhoup@gmail.com",
        username:"Sushil",
    });
    let member= await User.register(demouser, "12345");
    res.send(member);
})
// app.get('/',(req,res)=>{
//     res.send("Hi, i am a root");
// });

const validateListing= (req,res,next)=>{
      let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message.join(","));
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

const validateReview= (req,res,next)=>{
      let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message.join(","));
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

//index route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}));

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",(async(req,res)=>{
    let {id}= req.params;
    const objectId = new mongoose.Types.ObjectId(id.trim());
     // new mongoose.Types.ObjectId()
const listing = await Listing.findById(objectId).populate("review"); 
    res.render("listings/show.ejs",{listing});
}));

//create route
app.post("/listings",
    validateListing,
     wrapAsync(async(req,res,next)=>{
        const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing cfreated");
    res.redirect("/listings");
}));

//update route
app.put("/listings/:id", 
    validateListing,
    wrapAsync(async(req, res)=>{
     let {id}= req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     res.redirect(`/listings/${id}`);
}));

//edit route
app.get("/listing/:id/edit",wrapAsync(async(req, res)=>{
    let {id}= req.params;
    const objectId = new mongoose.Types.ObjectId(id.trim());
    const listing = await Listing.findById(objectId); 
    res.render("listings/edit.ejs",{listing});
}));

//delete route
app.delete("/listing/:id", wrapAsync(async(req, res)=>{
    let {id}= req.params;
    let deleteListing= await Listing.findByIdAndDelete(id.trim());
    res.redirect("/listings");
}));

//signup
app.get("/listings/signup", (req,res)=>{
    res.redirect("user/signup");
});


//review- post route
app.post("/listings/:id/review",
    validateReview,
    wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);

    listing.review.push(newReview);

    await listing.save();
    await newReview.save();

    res.redirect(`/listings/${listing._id}`);
}));

//review delete route
app.delete("/listings/:id/review/:reviewId", wrapAsync(async(req,res)=>{
    let{id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))
// app.all("*",(req,res,next) => {
//     next(new ExpressError(404,"Page not found!"));
// });

app.use((err, req,res,next)=>{
    let{statusCode=500, message="Something went wrong"}=err;
    res.render("error.ejs",{err});
})

app.listen(8080,()=>{
    console.log("Server is listening to port");
});