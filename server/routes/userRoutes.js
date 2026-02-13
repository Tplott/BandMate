const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getMyProfile,
  getUserById,
  updateProfile,
  searchMusicians,
} = require("../controllers/userController");

// GET /api/users/search?location=Nashville&instrument=Guitar
// Public — anyone can browse musicians (no login required)
router.get("/search", searchMusicians);

// GET /api/users/profile — get your own profile (must be logged in)
router.get("/profile", protect, getMyProfile);

// PUT /api/users/profile — update your profile (must be logged in)
router.put("/profile", protect, updateProfile);

// GET /api/users/:id — view any musician's public profile
router.get("/:id", getUserById);

module.exports = router;
