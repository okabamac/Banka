import Joi from 'joi';
// avatar: Joi.binary().encoding('base64').max(2 * 1024 * 1024)

const alphaNum = Joi.string().alphanum();
const nameSchema = alphaNum.min(2).max(30);
const emailSchema = Joi.string().email({
  minDomainAtoms: 2,
});

const userSignupSchema = Joi.object().keys({
  firstName: nameSchema.required(),
  lastName: nameSchema.required(),
  email: emailSchema.required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .options({
      language: {
        any: {
          allowOnly: 'must match password',
        },
      },
    }),
  type: Joi.string()
    .min(3)
    .max(15).default('client', {
      invalid: true,
    }),
  admin: Joi.boolean().default(false, {
    invalid: true,
  }),
});

const userSigninSchema = Joi.object().keys({
  email: emailSchema.required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

const createAccountSchema = Joi.object().keys({
  firstName: nameSchema.required(),
  lastName: nameSchema.required(),
  dob: Joi.date().min('1-1-1900').iso().required(),
  sex: Joi.string().min(4).max(10).required(),
  email: emailSchema.required(),
  phone: Joi.string().required(),
  type: Joi.string().valid('Savings', 'Current').required(),
  currency: Joi.string().default('Naira', {
    invalid: true,
  }),
  address: Joi.string().min(4).max(500).required(),
});

const patchAccountSchema = Joi.object().keys({
  status: Joi.string().max(10).required(),
});

const creditAccountSchema = Joi.object().keys({
  amount: Joi.number().integer().min(0).required(),
});

module.exports =  {
  userSignupSchema,
  userSigninSchema,
  createAccountSchema,
  patchAccountSchema,
  creditAccountSchema,
};
