import Joi from 'joi';
// avatar: Joi.binary().encoding('base64').max(2 * 1024 * 1024)

const nameSchema = Joi.string().trim().replace(/\s/g, '').min(2);
const emailSchema = Joi.object().keys({
  email: Joi.string().email({
    minDomainAtoms: 2,
  }).required(),
});
const userSignupSchema = Joi.object().keys({
  firstName: nameSchema.required(),
  lastName: nameSchema.required(),
  email: Joi.string().email({
    minDomainAtoms: 2,
  }).required(),
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
});

const addUserSchema = Joi.object().keys({
  firstName: nameSchema.required(),
  lastName: nameSchema.required(),
  email: Joi.string().email({
    minDomainAtoms: 2,
  }).required(),
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
    .max(15).default('staff', {
      invalid: true,
    })
    .required(),
  admin: Joi.boolean().default(false, {
    invalid: true,
  })
    .required(),
});
const userSigninSchema = Joi.object().keys({
  email: Joi.string().email({
    minDomainAtoms: 2,
  }).required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

const createAccountSchema = Joi.object().keys({
  type: Joi.string().trim().valid('Savings', 'Current').required(),
  openingBalance: Joi.number().min(0).precision(5).required(),
});

const patchAccountSchema = Joi.object().keys({
  status: Joi.string().trim().max(10).required(),
});

const creditAccountSchema = Joi.object().keys({
  amount: Joi.number().min(0).precision(5).required(),
});
const idSchema = Joi.object().keys({
  id: Joi.number().min(0),
});
const accountNumberSchema = Joi.object().keys({
  accountNumber: Joi.string().regex(/^[1-9]\d{9}$/).required(),
});

module.exports = {
  emailSchema,
  userSignupSchema,
  addUserSchema,
  userSigninSchema,
  createAccountSchema,
  patchAccountSchema,
  creditAccountSchema,
  idSchema,
  accountNumberSchema,  
};
