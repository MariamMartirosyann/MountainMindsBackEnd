const express = require("express");
const connetcDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
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

//Login Usercccc



app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Wrong Credenshials");
    }

    const isPasswordValid = bcrypt.compare(password);
    if (isPasswordValid) {
      res.send("Login is succseful");
    } else {
      throw new Error("Wrong Credenshials");
    }
  } catch (err) {
    res.status(400).send("Error adding a user:" + err.message);
  }
});
// Find a user
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (!users.lenght) {
      res.status(404).send("User is not found.");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Smth went wrong");
  }
});

//Find by id and Delete
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);

    res.send("User is deleted");
  } catch (err) {
    res.status(400).send("Smth went wrong");
  }
});

// Find a user by Id
app.get("/user/:id", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId).exec();

    res.send(user);
  } catch (err) {
    res.status(400).send("Smth went wrong");
  }
});

// Feed API- get all usres from DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Smth went wrong");
  }
});

//Update data of the user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: "true",
    });
    res.send("User updated");
  } catch (err) {
    res.status(400).send("Update failed:" + err.message);
  }
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
