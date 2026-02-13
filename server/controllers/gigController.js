const Gig = require("../models/Gig");
const Application = require("../models/Application");

// @desc    Create a new gig listing
// @route   POST /api/gigs
const createGig = async (req, res) => {
  try {
    const { title, description, venue, location, date, pay, instrumentsNeeded, genre } = req.body;

    const gig = await Gig.create({
      postedBy: req.user._id,
      title,
      description,
      venue,
      location,
      date,
      pay,
      instrumentsNeeded,
      genre,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all open gigs (for the gig board)
// @route   GET /api/gigs
const getAllGigs = async (req, res) => {
  try {
    const filter = { status: "open" }; // Only show gigs that are still available

    // Optional filters from query string
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.instrument) {
      filter.instrumentsNeeded = { $in: [new RegExp(req.query.instrument, "i")] };
    }
    if (req.query.genre) {
      filter.genre = { $regex: req.query.genre, $options: "i" };
    }

    const gigs = await Gig.find(filter)
      .populate("postedBy", "name location profilePic")
      .sort({ date: 1 }); // Sort by soonest date first

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single gig by ID
// @route   GET /api/gigs/:id
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("postedBy", "name location profilePic email");

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Apply for a gig
// @route   POST /api/gigs/:id/apply
const applyForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Check if this user already applied
    const alreadyApplied = await Application.findOne({
      gig: req.params.id,
      applicant: req.user._id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied for this gig" });
    }

    const application = await Application.create({
      gig: req.params.id,
      applicant: req.user._id,
      message: req.body.message || "",
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all applications for a gig (only the gig poster can see)
// @route   GET /api/gigs/:id/applications
const getGigApplications = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Only the person who posted the gig can view applications
    if (gig.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ gig: req.params.id })
      .populate("applicant", "name instruments genres location profilePic experienceLevel");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update application status (accept or reject)
// @route   PUT /api/gigs/:id/applications/:appId
const updateApplicationStatus = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Only the gig poster can accept/reject
    if (gig.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const application = await Application.findById(req.params.appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = req.body.status; // "accepted" or "rejected"
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a gig (only the poster can delete)
// @route   DELETE /api/gigs/:id
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this gig" });
    }

    await gig.deleteOne();
    res.json({ message: "Gig deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createGig,
  getAllGigs,
  getGigById,
  applyForGig,
  getGigApplications,
  updateApplicationStatus,
  deleteGig,
};
