import Joi from "joi";

export const signInSchemaValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signUpSchemaValidation = Joi.object().keys({
  name: Joi.string()
    .pattern(/^[a-zà-ú ,']+$/i)
    .min(3)
    .max(50)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  tel: Joi.string().alphanum().min(8).max(13).required(),
  cel: Joi.string().alphanum().min(9).max(14).required(),
  sex: Joi.string().valid("NOTKNOW", "MALE", "FEMALE", "NOTAPPLICABLE"),
  bio: Joi.string(),
});
