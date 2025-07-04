import Joi from "joi";

const start = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .custom((v, h) => (isNaN(Date.parse(v)) ? h.error("any.invalid") : v));
const end = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .custom((v, h) => {
    const s = h.state.ancestors[0].start;
    return new Date(v) < new Date(s) ? h.error("any.invalid") : v;
  });

export const eventCreateSchema = Joi.object({
  title: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  description: Joi.string().optional(),
  status: Joi.boolean().required(),
  start: start.required(),
  end: end.required(),
});

export const eventUpdateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.boolean().optional(),
  start: start.optional(),
  end: end.optional(),
});
