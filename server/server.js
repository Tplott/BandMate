// Load environment variables from .env file FIRST so they're available everywhere
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");   // Web framework - handles HTTP requests/responses
const cors = require("cors");         // Allows frontend (port 3000) to talk to backend (port 5000)
const connectDB = require("./config/db");  // Our MongoDB connection function

// Connect to MongoDB
connectDB();

// Create the Express app
const app = express();

// --- Middleware ---
// Middleware = functions that run on EVERY request before it hits your routes
app.use(cors());           // Allow cross-origin requests (frontend <-> backend)
app.use(express.json());   // Parse JSON bodies from incoming requests

// --- Routes ---
// Each line maps a URL path to a file that handles requests for that path
// Example: POST to /api/auth/register -> handled by authRoutes.js
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/gigs", require("./routes/gigRoutes"));

// Root route - just a health check to confirm the API is running
app.get("/", (req, res) => {
  res.json({ message: "BandMate API is running" });
});

// Start the server on port 5000 (or whatever PORT is in .env)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
