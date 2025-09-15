const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL="mongodb://127.0.0.1:27017/travel";

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err)
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner:'68a8b6e865d31456e71446c8'}));
    await Listing.insertMany(initData.data);
    console.log("data initialized");
};

initDB();