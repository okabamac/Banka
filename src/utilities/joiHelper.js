const Joi = require('joi');

const joiHelper = (req, res, schema) => {
  const result = Joi.validate(req.body, schema, {
    abortEarly: false,
  });
  if (result.error) {
    // 422 Validation Error
    const objError = [];
    Object.keys(result.error.details).forEach((key) => {
      objError.push(result.error.details[key].message);
    });
    return res.status(422).json({
      status: 422,
      error: objError,
    });
  }
  return result;
};
module.exports = joiHelper;
