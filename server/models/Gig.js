const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    pay: {
      type: Number,
      default: 0,
    },
    instrumentsNeeded: {
      type: [String],
      default: [],
    },
    genre: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "filled", "completed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gig", gigSchema);
