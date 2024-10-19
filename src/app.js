const express = require("express");
const connetcDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {
    console.log(req.body)
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added !!!!!!!!!!");
  } catch (err) {
    res.status(400).send("Error adding a user:" + err.message);
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
