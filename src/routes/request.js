const express = require("express");
const { userAuth } = require("../middleWares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRecuest");
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail");

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
        res.status(400).json({ message: "Invalid status type  " + status });
      }

      const connnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User is not" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request is already exists" });
      }
      const data = await connnectionRequest.save();

      const emailRes = await sendEmail.run(
        `A new friend request  from ${fromUser.firstName}`, `${fromUser.firstName}  ${status} ${toUser.firstName}`
      );
      console.log(emailRes, "email response");

      res.json({
        message: `${fromUser.firstName} ${status} ${toUser.firstName}`,
        data,
        emailRes,
      });
    } catch (err) {
      res.status(400).send("ERORR" + err.message);
    }
  }
);

// Review connnection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({ message: "Invalid status type  " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request is not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: "Connection Request is " + status, data });
    } catch (err) {
      res.status(400).send("ERORR" + err.message);
    }
  }
);
module.exports = requestRouter;
