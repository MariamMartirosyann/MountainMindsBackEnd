const express = require("express");
const { userAuth } = require("../middleWares/auth");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");

// View profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Edit profile

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit data.");
    }
    const logedInUser = req.user;

    Object.keys(req.body).forEach((key) => (logedInUser[key] = req.body[key]));
    await logedInUser.save();
    res.json({
      message: `${logedInUser.firstName}, your profile is upadeted`,
      data: logedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Update password
profileRouter.patch("/profile/update/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    user.password = null;
    const newPassword = req.body.password;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.json({
      message: `${user.firstName}, your password is apdated`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = profileRouter;
