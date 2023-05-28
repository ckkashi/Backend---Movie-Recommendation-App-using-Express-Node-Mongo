const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {body,validationResult} = require('express-validator');
const userModel = require('../models/userModel');
const getUser = require('../middlewares/getUser');

router.get('/verifyAuthRoute',(req,res)=>{
    res.status(200).json({msg:"Auth route working successfully."});
});

const registerUserValidation = [
    body('username','username must be of 3 charachter or more.').isLength({min:3}),
    body('email','invalid email.').isEmail(),
    body('password','password must be of 8 charachter or more.').isLength({min:8})
];

const loginUserValidation = [
    body('email','invalid email.').isEmail(),
    body('password','password must be of 8 charachter or more.').isLength({min:8})
];

// register route localhost:4000/auth/register
router.post('/register',registerUserValidation,async(req,res)=>{
    const {username,email,password} = req.body;
    try{
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.status(400).send({msg:"Invalidation error.",errors:validationErrors['errors'][0].msg});
        }
        // return res.status(200).json({username,email,password});
        let user = await userModel.findOne({
            "email":email
        });
        
        if(user){
            return res.status(400).send({msg:"User already registered on this email."});
        }
        
        const passwordSalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,passwordSalt);

        user = await userModel.create({username,email,"password":hashPassword,isAdmin:false});
        if(user){
            const userid = user._id;
            let token = jwt.sign({id:userid},process.env.ENKEY);
            return res.status(200).json({msg:"User successfully registered.",token});
        }
        return res.status(400).send({msg:"something went wrong."});
    }catch(e){
        return res.status(500).send({msg:"Internal server error.",error:e});
    }
});
// fetch user data to send token localhost:4000/auth/getUser
router.post('/getUser',getUser,async(req,res)=>{
    let user = await userModel.findOne({
        "_id":req.userid
    }).select('-password');
    
    if(!user){
        return res.status(404).send({msg:"User not found."});
    }
    return res.status(200).send({user});
});
// login route localhost:4000/auth/login
router.post('/login',loginUserValidation,async(req,res)=>{
    const {email,password} = req.body;
    try{
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.status(400).send({msg:"Invalidation error.",errors:validationErrors['errors'][0].msg});
        }
        // return res.status(200).json({username,email,password});
        let user = await userModel.findOne({
            "email":email
        });
        
        if(!user){
            return res.status(400).send({msg:"Invalid credential."});
        }
    
        const verifyPassword = await bcrypt.compare(password,user.password);

        if(verifyPassword){
            const userid = user._id;
            let token = jwt.sign({id:userid},process.env.ENKEY);
            return res.status(200).json({msg:"User loggedin successfully.",token});
        }
        return res.status(400).send({msg:"Invalid credential."});
    }catch(e){
        return res.status(500).send({msg:"Internal server error.",error:e});
    }
});

module.exports = router;