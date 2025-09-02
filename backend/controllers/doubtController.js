const Doubt = require("../models/Doubt");

// Create a doubt (with user association)
const createDoubt = async (req, res) => {
  try {
    const doubt = new Doubt({
      ...req.body,
      user: req.user._id // Automatically associate with authenticated user
    });
    await doubt.save();
    res.status(201).json(doubt);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      details: "Failed to create doubt. Please check your input."
    });
  }
};

// Get all doubts (for current user only)
const getDoubts = async (req, res) => {
  try {
    // Add filtering by user and optional status/date sorting
    const { status, sortBy } = req.query;
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    
    const sortOptions = {};
    if (sortBy === 'newest') sortOptions.createdAt = -1;
    if (sortBy === 'oldest') sortOptions.createdAt = 1;

    const doubts = await Doubt.find(query).sort(sortOptions);
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch doubts",
      error: error.message 
    });
  }
};

// Update doubt (with ownership verification)
const updateDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id // Ensure only owner can update
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!doubt) {
      return res.status(404).json({ 
        message: "Doubt not found or unauthorized",
        solution: "Check the doubt ID or your permissions"
      });
    }

    res.json(doubt);
  } catch (error) {
    res.status(400).json({ 
      message: "Update failed",
      error: error.message 
    });
  }
};

// Delete doubt (with ownership verification)
const deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id // Ensure only owner can delete
    });

    if (!doubt) {
      return res.status(404).json({ 
        message: "Doubt not found or unauthorized",
        solution: "Verify the doubt ID and your permissions"
      });
    }

    res.json({ 
      message: "Doubt deleted successfully",
      deletedDoubt: doubt 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Deletion failed",
      error: error.message 
    });
  }
};

// Additional specialized endpoint for resolving doubts
const resolveDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      { status: 'resolved' },
      { new: true }
    );

    if (!doubt) {
      return res.status(404).json({ 
        message: "Doubt not found or unauthorized" 
      });
    }

    res.json(doubt);
  } catch (error) {
    res.status(400).json({ 
      message: "Failed to resolve doubt",
      error: error.message 
    });
  }
};

module.exports = {
  createDoubt,
  getDoubts,
  updateDoubt,
  deleteDoubt,
  resolveDoubt
};