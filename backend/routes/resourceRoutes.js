const express = require("express");
const router = express.Router();
const {
  createResource,
  getResources,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

// Apply authentication to all resource routes
router.use(auth);

// CREATE - Protected route
router.post("/", createResource);

// READ - Protected route with optional query filters
router.get("/", getResources);

// UPDATE - Protected route with ID validation
router.put("/:id", validateObjectId, updateResource);

// DELETE - Protected route with ID validation
router.delete("/:id", validateObjectId, deleteResource);

module.exports = router;