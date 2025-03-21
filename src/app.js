const express = require("express");
const connetcDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors')
require('dotenv').config()

const app = express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
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
    app.listen(process.env.PORT, () => {
      console.log("Server is  listen to port 7777");
    });
  })
  .catch((err) => {
    console.error("DB can not be connected");
  });
