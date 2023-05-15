const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body
    if (!name && !email && !password) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        res.status(400).json({ success: false, message: "User Already Exists! Please Login" });
    }
    else {
        const user = await User.create({name, email, password, picture})
        if(user){
            const user2 = {
                "name": name,
                "email": email,
                "picture": picture,
                "_id": user._id
            }
            const token = await generateToken(user._id)
            res.status(200).json({success: true, message:"User Created Successfully! Redirecting...", token, user: user2});  
        }
        else{
            res.status(400).json({success: false, message:"Unable to create user!"});  
        }
    }
})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email && !password) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
        if(await user.matchPassword(password)){
            const token = await generateToken(user._id)
            const user2 = {
                "name": user.name,
                "email": user.email,
                "picture": user.picture,
                "_id": user._id
            }
            res.status(200).json({ success: true, message: "Login successful", token, user: user2 });
        }
        else{
            res.status(400).json({ success: false, message: "Invalid Credentials!" });
        }
    }
    else {
        res.status(400).json({ success: false, message: "Invalid Credentials!" });
    }
})

const getUser = asyncHandler(async(req,res)=>{
    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: 'i'}},
            {email: {$regex: req.query.search, $options: 'i'}},
        ]
    }:{};
    const users = await User.find(keyword).find({_id: {$ne: req.user._id}})
    res.status(200).json(users)
})

module.exports = { registerUser, loginUser, getUser }