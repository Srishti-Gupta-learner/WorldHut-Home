if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express= require("express");
const app = express();
const path= require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session= require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const localStratagey = require("passport-local");   
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

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
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

app.get("/listings/demouser",async(req,res)=>{
    const demouser= new User({
        email:"drtsrhoup@gmail.com",
        username:"Sushil",
    });
    let member= await User.register(demouser, "12345");
    res.send(member);
});

app.get('/',(req,res)=>{
    res.send("Hi, i am a root");
});

// app.use((req,res,next) => {
//     next(new ExpressError(404,"Page not found!"));
// });

// app.use((err, req,res,next)=>{
//     let{statusCode=500, message="Something went wrong"}=err;
//     res.render("error.ejs",{err});
// });


app.listen(8080,()=>{
    console.log("Server is listening to port");
});