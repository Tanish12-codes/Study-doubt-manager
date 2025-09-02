const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const validate = require('../middleware/validate'); // Now this will work
const rateLimit = require('../middleware/rateLimit');
const {
  registerValidation,
  loginValidation
} = require('../validation/authValidations');

// Apply rate limiting to auth routes
router.use(rateLimit.authLimiter);

// Register route with validation
router.post(
  '/register',
  validate(registerValidation),  // Keep original validation schema for register
  registerUser
);

// Login route with validation
router.post(
  '/login',
  validate(loginValidation),  // Keep original validation schema for login
  loginUser
);

module.exports = router;
