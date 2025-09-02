const { body } = require('express-validator');

const updateDoubtValidation = [
  body('title')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
];

module.exports = updateDoubtValidation;
