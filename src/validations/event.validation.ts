import Joi from "joi";

export const eventCreateSchema = Joi.object({
  title: Joi.string().required(),
  quantity: Joi.number().required(),
  description: Joi.string().optional(),
  status: Joi.string().required(),
  start: Joi.string().required(),
  end: Joi.string().required(),
});
