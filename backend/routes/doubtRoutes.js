const express = require("express");
const router = express.Router();
const {
  createDoubt,
  getDoubts,
  updateDoubt,
  deleteDoubt,
  resolveDoubt
} = require("../controllers/doubtController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate"); // Middleware for validation
const validateObjectId = require("../middleware/validateObjectId"); // Middleware for ObjectId validation
const { createDoubtValidation } = require("../validation/createDoubtValidation"); // Corrected import
const updateDoubtValidation = require("../validation/updateDoubtValidation"); // Import update validation

// Apply authentication middleware to all doubt routes
router.use(auth);

// CREATE (use validate with the validation schema)
router.post("/", validate(createDoubtValidation), createDoubt);

// READ (with optional query parameters)
router.get("/", getDoubts);

// UPDATE (use validate and validateObjectId)
router.put("/:id", validateObjectId, validate(updateDoubtValidation), updateDoubt);

// SPECIALIZED UPDATE (mark as resolved)
router.patch("/:id/resolve", validateObjectId, resolveDoubt);

// DELETE
router.delete("/:id", validateObjectId, deleteDoubt);

module.exports = router;
