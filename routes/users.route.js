const express = require("express");
const {userModel} = require("../models/user.model")
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require("dotenv").config();
const saltRounds = process.env.saltRounds;
const usersRouter = express.Router();

usersRouter.get("/",(req,res) => {
    res.send({msg:"Welcome to project"});
})

usersRouter.post("/signup",(req,res)=>{
    const data = req.body;
    bcrypt.hash(data.password, +saltRounds, async (err, hash) => {
        if(err){
            res.send({msg:"Something went wrong"});
        }
        else{
            data.password = hash;
            const user = new userModel(data);
            await user.save();
            res.send({msg:"signup successful"});
        }
    });
})


usersRouter.post("/login",async(req,res)=>{
    const data = req.body;
    const dbdata = await userModel.find({email:req.body.email});
    const token = jwt.sign(data, process.env.key);
    if(dbdata.length === 0){
        res.send({msg:"Account does not exist"});
    }
    else{
        bcrypt.compare(data.password, dbdata[0].password).then((result) => {
            if(result){
                res.send({
                    msg:"login successful",
                    token
            });
            }
            else{
                res.send({msg:"password do not match"});
            }
        });
    }
})

module.exports = {
    usersRouter
}