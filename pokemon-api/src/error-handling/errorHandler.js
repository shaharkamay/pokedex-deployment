const express = require("express");
const fs = require("fs");
const path = require("path");
const userRouter = express.Router();
const Pokedex = require("pokedex-promise-v2");
const pokedex = new Pokedex();

module.exports.errorHandler = (err, req, res, next) => {
    console.log(err);
    res.json({status: err.status, message: err.message});
    res.end();
}