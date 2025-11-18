const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = ()=>{
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log("mongodb connected");
    }
    catch(err){
        console.log(err);
    }
}
    
module.exports = connectDB;