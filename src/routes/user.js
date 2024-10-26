const express = require("express");
const { model } = require("mongoose");
const { userAuth } = require("../middleWares/auth");
const ConnectionRequest = require("../models/connectionRecuest");
const User= require("../models/user")

const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoURL",
  "age",
  "gender",
  "skills",
  "about",
];

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
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ message: "Data Fetch succcesfully", data });
  } catch (err) {
    res.status(400).send("ERORR" + err.message);
  }
});

//Get people data to ignoe or accept
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page=parseInt(req.query.page) ||1
    let limit=parseInt(req.query.limit)||10
    limit= limit>50?50: limit
    const skip=(page-1)*limit

    // Find connection witch user send or resevied
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
       $and:[{_id:{$nin:Array.from(hideUsersFromFeed)}},{_id:{$ne:loggedInUser._id}}] 
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)

    res.json({ data: users });
  } catch (err) {
    res.status(400).send("ERORR" + err.message);
  }
});
module.exports = userRouter;
