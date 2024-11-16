const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


const authRouter = express.Router();

//Sign up User
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added !!!!!!!!!!");
  } catch (err) {
    res.status(400).send("Error adding a user:" + err.message);
  }
});

//Login User
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Wrong Credenshials ");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Wrong Credenshials ");
    }
  } catch (err) {
    res.status(400).send("Error adding a user:" + err.message);
  }
});

//Log out User
authRouter.post("/logout", async (req, res) => {
 res.cookie("token",null,{expires:new Date(Date.now())})
 res.send("Logout succsesful")
});

module.exports = authRouter;
