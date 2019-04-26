import Joi from 'joi';

const joiHelper = (schema1, schema2) => (req, res, next) => {
  if (schema1 !== undefined && (req.params.accountNumber || req.params.id || req.params.email)) {
    const result = Joi.validate(req.params, schema1, {
      abortEarly: false,
    });
    if (result.error) {
      // 400 Validation Error
      const objError = [];
      Object.keys(result.error.details).forEach((key) => {
        objError.push(result.error.details[key].message);
      });
      return res.status(400).json({
        status: 400,
        error: objError,
      });
    }
  } 

  if (schema2 !== undefined) {
    const result = Joi.validate(req.body, schema2, {
      abortEarly: false,
    });
    if (result.error) {
      // 400 Validation Error
      const objError = [];
      Object.keys(result.error.details).forEach((key) => {
        objError.push(result.error.details[key].message);
      });
      return res.status(400).json({
        status: 400,
        error: objError,
      });
    }
  }

  return next();
};
export default joiHelper;
