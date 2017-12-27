var Joi = require('joi');
module.exports = {
  options: {
    status: 422,
    statusText: 'Unprocessable Entity'
  },
  body: {
    email: {
      email: Joi.string().email().min(8).max(100)
    }
  }
};