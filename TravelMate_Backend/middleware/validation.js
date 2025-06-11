const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const cityNameSchema = Joi.object({
  cityName: Joi.string().min(2).max(100).required()
});

const placeIdSchema = Joi.object({
  placeId: Joi.string().required()
});

module.exports = {
  validateRequest,
  cityNameSchema,
  placeIdSchema
};
