const Resource = require("../models/Resource");

// Create a resource (now user-specific)
const createResource = async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      user: req.user._id  // Add the authenticated user's ID
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all resources (only for the authenticated user)
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ user: req.user._id });  // Filter by user
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a resource (with user ownership check)
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      user: req.user._id  // Ensure user owns the resource
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found or unauthorized" });
    }

    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a resource (with user ownership check)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      user: req.user._id  // Ensure user owns the resource
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found or unauthorized" });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource,
};