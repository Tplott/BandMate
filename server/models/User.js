const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    instruments: {
      type: [String],
      default: [],
    },
    genres: {
      type: [String],
      default: [],
    },
    profilePic: {
      type: String,
      default: "",
    },
    photos: {
      type: [String], // Array of photo URLs for their profile gallery
      default: [],
    },
    videos: {
      type: [String], // Array of video URLs showcasing their playing
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "professional"],
      default: "intermediate",
    },
    lookingFor: {
      type: [String], // What they want: ["band", "jam session", "gigs", "collaboration"]
      default: [],
    },
    influences: {
      type: [String], // e.g. ["Jimi Hendrix", "John Mayer", "SRV"]
      default: [],
    },
    availability: {
      type: String, // e.g. "Weekends", "Evenings", "Anytime"
      default: "",
    },
    role: {
      type: String,
      enum: ["musician", "venue"],
      default: "musician",
    },
  },
  {
    timestamps: true,
  }
);

// Before saving, hash the password so we never store plain text
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
