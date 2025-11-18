const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    fullName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    address:{
        type:String
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    password:{
        type:String
    }
})

const foodPartner = mongoose.model("foodpartner",foodPartnerSchema);

module.exports = foodPartner;