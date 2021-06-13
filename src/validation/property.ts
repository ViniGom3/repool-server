import Joi from "joi";

export const propertySchemaValidation = Joi.object().keys({
  name: Joi.string()
    .pattern(/^[a-zà-ú ]+$/i)
    .min(5)
    .max(50)
    .required(),
  description: Joi.string(),
  category: Joi.string().valid("HOUSE", "APARTMENT"),
  vacancyPrice: Joi.string()
    .pattern(/[0-9.,]+$/i)
    .required(),
  cep: Joi.string()
    .pattern(/[0-9]{5}[0-9]{3}/)
    .required(),
  street: Joi.string()
    .pattern(/^[a-zà-ú0-9 ,'-]+$/i)
    .min(3)
    .max(100)
    .required(),
  neighborhood: Joi.string()
    .pattern(/^[a-zà-ú0-9 ,'-]+$/i)
    .min(3)
    .max(100)
    .required(),
  city: Joi.string()
    .pattern(/^[a-zà-ú ]+$/i)
    .min(3)
    .max(50)
    .required(),
  uf: Joi.string().alphanum().min(2).max(5).required(),
  country: Joi.string().alphanum().min(2).max(25).required(),
  number: Joi.string().min(1),
  complement: Joi.string()
    .pattern(/^[a-zà-ú0-9 ,':-]+$/i)
    .min(3)
    .max(100),
  hasPool: Joi.string().valid("true", "false"),
  hasGarage: Joi.string().valid("true", "false"),
  hasGourmet: Joi.string().valid("true", "false"),
  hasInternet: Joi.string().valid("true", "false"),
  isPetFriendly: Joi.string().valid("true", "false"),
  isAdvertisement: Joi.string().valid("true", "false"),
  vacancyNumber: Joi.string()
    .pattern(/[0-9]+$/i)
    .min(1)
    .max(4),
});
