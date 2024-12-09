// Validates incoming request data based on defined schemas (e.g., using Joi)
// Future Work
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation errors.",
        errors,
      });
    }

    next();
  };
};

module.exports = validateRequest;
