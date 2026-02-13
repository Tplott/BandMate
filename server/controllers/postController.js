const Post = require("../models/Post");

// @desc    Create a new post (music clip)
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const { caption, mediaUrl, mediaType, instrument } = req.body;

    // req.user._id comes from the protect middleware (decoded from JWT token)
    const post = await Post.create({
      user: req.user._id,
      caption,
      mediaUrl,
      mediaType,
      instrument,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all posts (for the home feed)
// @route   GET /api/posts
const getAllPosts = async (req, res) => {
  try {
    // .populate("user", "name profilePic instruments location") replaces the user ID
    // with the actual user data — but ONLY the fields we list (name, profilePic, etc.)
    // This way each post comes with the poster's name and photo attached
    const posts = await Post.find()
      .populate("user", "name profilePic instruments location")
      .sort({ createdAt: -1 }); // Newest posts first

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all posts by a specific user
// @route   GET /api/posts/user/:userId
const getPostsByUser = async (req, res) => {
  try {
    // Find all posts where the user field matches the userId from the URL
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "name profilePic instruments location")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Like or unlike a post (toggle)
// @route   PUT /api/posts/:id/like
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if this user already liked the post
    // .toString() because MongoDB ObjectIds need to be converted to strings to compare
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Remove their like (unlike)
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Add their like
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a post (only the owner can delete)
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Make sure the logged-in user is the one who created the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createPost, getAllPosts, getPostsByUser, toggleLike, deletePost };
