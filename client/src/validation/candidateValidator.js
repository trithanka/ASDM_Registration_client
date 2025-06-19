const Joi = require("joi");

exports.basicDetails = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email1: Joi.string(),
  mobile1: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid mobile number format",
      "string.empty": "Mobile number is required",
      "any.required": "Mobile number is required",
    }),

    // obj: Joi.object({
    //   jvId: Joi.string()
    //     .required()
    // }).optional(),

    jvId:Joi.optional(),
    middleName:Joi.optional(),
    certName:Joi.optional(),
    fatherName:Joi.optional(),
    motherName:Joi.optional(),
    empExchangeNo:Joi.optional(),
    dob:Joi.optional(),
    uuid:Joi.optional(),
    gender:Joi.optional(),
    religionId:Joi.optional(),
    registrationTypeId:Joi.optional(),
    registrationDate:Joi.optional(),
    isBPLCardHolder:Joi.optional(),
    isAntodayaCardHolder:Joi.optional(),
    isNregaCardHolder:Joi.optional(),
    isMinority:Joi.optional(),
    isBoCw:Joi.optional(),
    isTeaTribeMinoriy:Joi.optional(),
    idType:Joi.optional(),
    mobileCountryCode:Joi.optional(),
    otherMobileNo:Joi.optional(),
    qualificationId:Joi.optional(),
    qualificationId:Joi.optional(),
    selectedPreferenceArr:Joi.optional(),
    selectedPreferenceArr:Joi.optional(),
    selectedPreferenceArr:Joi.optional(),
    isDisability:Joi.optional(),
    countryId:Joi.optional(),
    stateId:Joi.optional(),
    districtId:Joi.optional(),
    talukaId:Joi.optional(),
    ulbId:Joi.optional(),
    areaType:Joi.optional(),
    address:Joi.optional(),
    cityName:Joi.optional(),
    policeStation:Joi.optional(),
    pinCode:Joi.optional(),
    addressType:Joi.optional(),
    assemblyConstituencyId:Joi.optional(),
    loksabhaConstituencyId:Joi.optional(),
    postOffice:Joi.optional(),
    fklCasteCategoryId:Joi.optional()
});
