const express = require("express");
const { userAuth } = require("../middleWares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRecuest");
const User = require("../models/user");

//Sending connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUser = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({ message: "Invalid ststus type  " + status });
      }

      const connnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(404).json({message:"User is not"})
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if(existingConnectionRequest) {
       return  res
          .status(404)
          .json({ message: "Connection Request is already exists" });
      }
      const data = await connnectionRequest.save();
      res.json({
        message: `${fromUser.firstName} ${status} ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERORR" + err.message);
    }
  }
);

module.exports = requestRouter;
