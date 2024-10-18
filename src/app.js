const express = require("express");

const app = express();

app.get("/user/:userID/:name", (req, res) => {
    console.log(req.params)
  res.send({ fistName: "Mariam", lastName: "Martirsoyan" });
});
// app.post("/user", (req, res) => {
//   res.send("Data saved to DB");
// });
// app.delete("/user", (req, res) => {
//     res.send("Data deleted.");
//   });
//handle all routes
// app.use((req, res) => {
//   res.send("Hello!");
// });

app.listen(3000, () => {
  console.log("Server is  listen to port 3000");
});
