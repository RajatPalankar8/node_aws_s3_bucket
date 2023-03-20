const router = require("express").Router();
const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const secretKey = "AnyCharacterKey";
const Crypto = require("crypto-js");
const Auth= require('../middleWare/auth.middleware')

router.post('/register',async (req,res)=>{
    try {
        console.log("---req body---", req.body);
        const { name } = req.body;
        const payload = {
            name
          };
          const str = name + new Date().getTime().toString().slice(0, 20);
          const apiKey = Crypto.SHA256(str).toString().slice(0, 18);

        const userCreated = new UserModel({name,apiKey});
        await userCreated.save();
        res.json({ status: true, success: "User Registered Successfully" });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
});


router.post('/login',Auth.userAuthMiddleWare,async (req,res)=>{
    try {
        console.log("---req body---", req.user);
        if(req.user){
           return  res.json({ status: true, success: "Login Successful" });
        }
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
});

module.exports = router;
