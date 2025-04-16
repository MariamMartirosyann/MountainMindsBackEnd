const express = require("express");
const connetcDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const http=require("http")
const inishializeSocket = require("./utils/socket")

require('dotenv').config()
require("./utils/cronjob")

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
const paymentRouter = require("./routes/paymnet")
const chatRouter = require("./routes/chats")


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", paymentRouter)
app.use("/", chatRouter)

const server=http.createServer(app)
inishializeSocket(server)

connetcDB()
  .then(() => {
    console.log("DB is connected!");
    server.listen(process.env.PORT, () => {
      console.log("Server is  listen to port 7777");
    });
  })
  .catch((err) => {
    console.error("DB can not be connected");
  });
