const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createPost,
  getAllPosts,
  getPostsByUser,
  toggleLike,
  deletePost,
} = require("../controllers/postController");

// GET /api/posts — get all posts for the feed (public)
router.get("/", getAllPosts);

// GET /api/posts/user/:userId — get all posts by one user (public)
router.get("/user/:userId", getPostsByUser);

// POST /api/posts — create a new post (must be logged in)
router.post("/", protect, createPost);

// PUT /api/posts/:id/like — like or unlike a post (must be logged in)
router.put("/:id/like", protect, toggleLike);

// DELETE /api/posts/:id — delete your own post (must be logged in)
router.delete("/:id", protect, deletePost);

module.exports = router;
