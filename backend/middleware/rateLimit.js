const rateLimit = require('express-rate-limit');

// Limit repeated requests to auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many login or register attempts from this IP, please try again after 15 minutes.'
});

module.exports = {
  authLimiter
};
