const User = require("../models/User");

// @desc    Get the logged-in user's own profile
// @route   GET /api/users/profile
const getMyProfile = async (req, res) => {
  try {
    // req.user was set by the protect middleware (it decoded the token)
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get any user's public profile by their ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    // req.params.id comes from the URL — e.g. /api/users/abc123 → id = "abc123"
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update the logged-in user's profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields that were sent in the request
    // If req.body.name exists, use it — otherwise keep the current value
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.instruments = req.body.instruments || user.instruments;
    user.genres = req.body.genres || user.genres;
    user.profilePic = req.body.profilePic || user.profilePic;
    user.photos = req.body.photos || user.photos;
    user.videos = req.body.videos || user.videos;
    user.experienceLevel = req.body.experienceLevel || user.experienceLevel;
    user.lookingFor = req.body.lookingFor || user.lookingFor;
    user.influences = req.body.influences || user.influences;
    user.availability = req.body.availability || user.availability;

    // Save the updated user to the database
    const updatedUser = await user.save();

    // Send back the updated profile (without password)
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      location: updatedUser.location,
      instruments: updatedUser.instruments,
      genres: updatedUser.genres,
      profilePic: updatedUser.profilePic,
      photos: updatedUser.photos,
      videos: updatedUser.videos,
      experienceLevel: updatedUser.experienceLevel,
      lookingFor: updatedUser.lookingFor,
      influences: updatedUser.influences,
      availability: updatedUser.availability,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Search/browse musicians with filters
// @route   GET /api/users/search?location=Nashville&instrument=Guitar&genre=Rock
const searchMusicians = async (req, res) => {
  try {
    // Build a filter object based on what query parameters were sent
    const filter = { role: "musician" }; // Only show musicians, not venues

    // If they searched by location, use a case-insensitive partial match
    // So "nash" would match "Nashville" — the "i" flag means case-insensitive
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }

    // If they filtered by instrument, check if the instruments array contains it
    if (req.query.instrument) {
      filter.instruments = { $in: [new RegExp(req.query.instrument, "i")] };
    }

    // If they filtered by genre
    if (req.query.genre) {
      filter.genres = { $in: [new RegExp(req.query.genre, "i")] };
    }

    // If they filtered by experience level (exact match)
    if (req.query.experienceLevel) {
      filter.experienceLevel = req.query.experienceLevel;
    }

    // Find matching users, exclude passwords, sort by newest first
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyProfile, getUserById, updateProfile, searchMusicians };
