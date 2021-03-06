import Joi from "joi";

export * from "./user";
export * from "./property";
export * from "./rent";

export default function schemaValidator(
  schema: Joi.ObjectSchema<any>,
  body: any
) {
  const { error } = schema.validate(body);
  return error;
}
