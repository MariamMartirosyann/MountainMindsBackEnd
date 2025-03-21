const mongoose = require("mongoose");


const connetcDB = async () => {
await  mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = connetcDB;
