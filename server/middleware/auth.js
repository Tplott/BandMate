const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This middleware protects routes that require login
// It checks for a JWT token in the request header
// If valid, it attaches the user's data to req.user so the route can use it
const protect = async (req, res, next) => {
  let token;

  // Check if the request has an Authorization header with a Bearer token
  // It looks like: "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Pull the token out (everything after "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      // If someone tampered with it, this will throw an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the ID stored in the token
      // select("-password") means "give me everything EXCEPT the password"
      req.user = await User.findById(decoded.id).select("-password");

      // Move on to the actual route handler
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
