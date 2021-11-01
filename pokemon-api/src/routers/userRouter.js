const express = require("express");
const fs = require("fs");
const path = require("path");
const userRouter = express.Router();
const Pokedex = require("pokedex-promise-v2");
const pokedex = new Pokedex();


userRouter.post("/info", (req, res, next) => {
    const  username  = req.username;
    try {
        if(username){
            res.status(200).json(username);
            res.end();
        }else{
            next({ status: 401, message: "user doesnt exist!" });
        }
    } catch (err) {
        console.log("Something went wrong with your request");
        next({status: 500 , message: "internal server error"});
    }
})

module.exports = userRouter;