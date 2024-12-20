// FUTURE WORK: IMPLEMENT SCHEMAS FOR ROUTES
const Joi = require("joi");

const schemas = {
  login: Joi.object({
    user: Joi.object({
      userName: Joi.string().max(50).optional().label("userName"),
      userEmail: Joi.string().email().max(100).optional().label("userEmail"),
      userPassword: Joi.string().min(1).required().label("userPassword"),
    }),
  }),

  updateUser: Joi.object({
    userId: Joi.number().required().label("User ID"),
    username: Joi.string().max(50).optional().label("Username"),
    email: Joi.string().email().max(100).optional().label("Email"),
    age: Joi.number().integer().min(18).optional().label("Age"),
  }),
};

module.exports = schemas;
