const mongoose = require("mongoose");

// A connection request from one musician to another
// Like a friend request - "Hey, I'd like to jam with you"
const connectionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String, // "Hey, I play drums and I'm looking for a guitarist to jam with!"
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Connection", connectionSchema);
