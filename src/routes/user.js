const express = require("express");
const { model } = require("mongoose");
const { userAuth } = require("../middleWares/auth");
const ConnectionRequest = require("../models/connectionRecuest");

const userRouter = express.Router();

const USER_SAFE_DATA=["firstName",
        "lastName",
        "photoURL",
        "age",
        "gender",
        "skills",
        "about"]

// Get all pending connection requests for loggedin user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({ message: "Data Fetch succcesfully", data: connectionRequests });
  } catch (err) {
    res.status(400).send("ERORR" + err.message);
  }
});

//Get all Metches for loggedin user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId",USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
        if( row.fromUserId._id.toString()===loggedInUser._id.toString()){
          return  row.toUserId
        }
        return row.fromUserId
    });
    res.json({ message: "Data Fetch succcesfully", data });
  } catch (err) {
    res.status(400).send("ERORR" + err.message);
  }
});
module.exports = userRouter;
