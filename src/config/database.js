const mongoose = require("mongoose");

const connetcDB = async () => {
  mongoose.connect(
    "mongodb+srv://mmartirosyandeveloper:3cdBxEUXEyoLbj1u@cluster0.sok7s.mongodb.net/mountainMinds?retryWrites=true&w=majority"
    
  );
};

module.exports = connetcDB;
