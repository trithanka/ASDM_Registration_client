const Joi = require("joi");

exports.companyDetails = Joi.object({
  companyName: Joi.string().required(),
  companyEmail: Joi.string().required(),
  companyMobile: Joi.string().required(),
  companyAddress: Joi.string().required(),
  pinCode: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  companyType: Joi.number().required(),
  fklOrganizationTypeId: Joi.number().optional(),
  pan: Joi.string().optional()
});