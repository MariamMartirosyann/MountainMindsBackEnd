const express = require("express");
const connetcDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter= require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

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
