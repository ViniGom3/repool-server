import Joi from "joi";

export const updateEvaluateSchemaValidation = Joi.object().keys({
  value: Joi.number().greater(0).less(6),
  comment: Joi.string(),
});
