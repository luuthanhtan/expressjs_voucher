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
export const voucherCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.boolean().required(),
  startDate: start.required(),
  expireDate: end.required(),
  value: Joi.number().required(),
  isPercent: Joi.boolean().required(),
  eventId: Joi.string().length(24).hex().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const voucherUpdateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.boolean().optional(),
  startDate: start.optional(),
  expireDate: end.optional(),
  value: Joi.number().optional(),
  isPercent: Joi.boolean().optional(),
});
