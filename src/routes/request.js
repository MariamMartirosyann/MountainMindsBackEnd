const express = require("express");
const { userAuth } = require("../middleWares/auth");
const requestRouter= express.Router()

//Sending connection request
requestRouter.post("/sendingConectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " is sedning conection request");
  });
  

module.exports=requestRouter