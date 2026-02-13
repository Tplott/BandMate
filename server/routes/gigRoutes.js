const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createGig,
  getAllGigs,
  getGigById,
  applyForGig,
  getGigApplications,
  updateApplicationStatus,
  deleteGig,
} = require("../controllers/gigController");

// GET /api/gigs — browse all open gigs (public)
router.get("/", getAllGigs);

// GET /api/gigs/:id — view a single gig's details (public)
router.get("/:id", getGigById);

// POST /api/gigs — create a new gig listing (must be logged in)
router.post("/", protect, createGig);

// POST /api/gigs/:id/apply — apply for a gig (must be logged in)
router.post("/:id/apply", protect, applyForGig);

// GET /api/gigs/:id/applications — see who applied (only gig poster)
router.get("/:id/applications", protect, getGigApplications);

// PUT /api/gigs/:id/applications/:appId — accept or reject an applicant (only gig poster)
router.put("/:id/applications/:appId", protect, updateApplicationStatus);

// DELETE /api/gigs/:id — delete a gig (only gig poster)
router.delete("/:id", protect, deleteGig);

module.exports = router;
