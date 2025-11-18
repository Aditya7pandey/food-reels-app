const userModel = require('../models/user.model');
const foodPartner = require('../models/foodPartner.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req,res)=>{
    const {fullName,email,password} = req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({
            message:"All fields are required"
        })      
    }
    
    try{
        const isUserAlreadyExists = await userModel.findOne({
            email
        })

        if(isUserAlreadyExists){
            return res.status(400).json({
                message:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await userModel.create({
            fullName,
            email,
            password:hashedPassword
        })

        const token = jwt.sign({
            id:user._id
        },process.env.JWT_SECRET);

        res.cookie("token",token);
        
        res.status(201).json({
            message:"user registered successfully",
            fullName:user.fullName,
            _id: user._id,
            email: user.email
        })
    }
    catch(err){
        console.log(err+" in register");
    }
}

const login = async (req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid email or password"
            })
        }

        const check = await bcrypt.compare(password,user.password);

        if(!check){
            return res.status(400).json({
                message:"Invalid email or password"
            })
        }

        const token = jwt.sign({
            id:user._id
        },process.env.JWT_SECRET);

        res.cookie("token",token);

        res.status(200).json({
            message:"user logged in succesfully",
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        })
    }
    catch(err){
        console.log(err);
    }
}

const logout = async (req,res) =>{
    res.clearCookie('token');
    res.status(200).json({
        message:"user logged out successfully"
    })
}

const partnerRegister = async (req,res) =>{
    try{
        const {fullName,password,email} = req.body;

        if(!fullName || !password || !email){
            return res.status(400).json({
                message:"all feilds required"
            })
        }

        const userExists = await foodPartner.findOne({
            email
        })
        
        if(userExists){
            return res.status(400).json({
                message:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await foodPartner.create({
            fullName,
            email,
            password:hashedPassword
        })

        const token  = jwt.sign({
            id:user._id
        },process.env.JWT_SECRET);
        
        res.cookie("token",token);

        res.status(200).json({
            message:"user registered successfully",
            fullName:user.fullName,
            _id:user.id,
            email:user.email
        })

    }
    catch(error){
        res.status(404).json({
            message:`${error}`
        })
    }
}

const partnerLogin = async(req,res) =>{
    try{
        const {email,password} = req.body;

        const user = await foodPartner.findOne({
            email
        })

        if(!user){
            return res.status(400).json({
                message:"user does'nt exist"
            })
        }

        const check = await bcrypt.compare(password,user.password);

        if(!check){
            return res.status(400).json({
                message:"Incorrect password or email"
            })
        }

        const token = jwt.sign({
            id:user._id
        },process.env.JWT_SECRET)

        res.cookie("token",token)

        res.status(200).json({
            message:"user login successfully",
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        })
    }
    catch(error){
        res.status(404).json({
            message:`${error}`
        })
    }
}

const partnerLogout = async (req,res) =>{
    res.clearCookie('token');
    res.status(200).json({
        message:"user logged out successfully"
    })
}

const addPartnerAddress = async (req,res) =>{
    try{
        const partnerId = req.foodPartner._id;
        const {address} = req.body;

        const updatedPartner = await foodPartner.findByIdAndUpdate(
            partnerId,
            {address},
            {new:true}
        ) 
        
        if(!updatedPartner){
            return res.json("user not found");
        }
    
        res.json({
            message:"partner is updated",
            updatedPartner
        })
    }
    catch(error){
        res.json(error);
    }
}

module.exports = {
    register,
    login,
    logout,
    partnerRegister,
    partnerLogin,
    partnerLogout,
    addPartnerAddress
}