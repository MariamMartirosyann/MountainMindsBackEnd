const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User", // referance to the user collection
      required: true,
    },
    toUserId: { type: mongoose.Schema.Types.ObjectId,ref:"User", required: true },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect data type`,
      },
      required: true,
    },
  },
  { timestamps: true }
);


connectionRequestSchema.index({fromUserId:1, toUserId:1})

connectionRequestSchema.pre("save",function(next){
 const connectionRecuest=this
 if(connectionRecuest.fromUserId.equals(connectionRecuest.toUserId)){
    throw new Error("You can not send connection request to yourself")
 }
 next()
})

const ConnectionRequest= new mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports = ConnectionRequest;
