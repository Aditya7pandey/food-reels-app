const foodPartnerModel = require('../models/foodPartner.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

const authFoodPartnerMiddleware = async (req,res,next)=>{
    const cookie = req.cookies.token;
    if(!cookie){
        return res.status(401).json({
            message:"Unauthorized access"
        })
    }

    try{
        const decode = jwt.verify(cookie,process.env.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findById(decode.id)

        req.foodPartner = foodPartner;
        next();
    }
    catch(err){
        console.log(err)
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
}

const authUserMiddleware = async (req,res,next) =>{
    const token = req.cookies.token
    if(!token){
        return res.json("Invalid token");
    }

    try{
        const CheckUser = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(CheckUser.id);

        if(!user){
            res.json("Unauthorized acess");
        }

        req.user = user
        next();
    }
    catch(error){
        res.json(error);
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}