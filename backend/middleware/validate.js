const { validationResult } = require('express-validator');

const validate = (schema) => {
  return async (req, res, next) => {
    console.log('Validating request body:', req.body);

    await Promise.all(schema.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Validation passed');
    next();
  };
};

module.exports = validate;
