import Joi from "joi";

export * from "./user";
export * from "./property";

export default function schemaValidator(
  schema: Joi.ObjectSchema<any>,
  body: any
) {
  const validateResult = schema.validate(body);
  return validateResult.error;
}
