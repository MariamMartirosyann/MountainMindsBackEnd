const express = require("express");
const connetcDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleWares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

//Sign up User
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Wrong Credenshials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create JWT Token

      const token = await jwt.sign({ _id: user._id }, "Mariam",{expiresIn:"1d"});

      //Add the Token to cookie and send the response back to the user

      res.cookie("token", token,{expires:new Date(Date.now() + 8 * 3600000)});
      res.send("Login is succseful");
    } else {
      throw new Error("Wrong Credenshials");
    }
  } catch (err) {
    res.status(400).send("Error adding a user:" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Sending connection request

app.post("/sendingConectionRequest", userAuth, async (req, res) => {
  const user= req.user
  res.send(user.firstName +" is sedning conection request");
});

connetcDB()
  .then(() => {
    console.log("DB is connected!");
    app.listen(3000, () => {
      console.log("Server is  listen to port 3000");
    });
  })
  .catch((err) => {
    console.error("DB can not be connected");
  });
