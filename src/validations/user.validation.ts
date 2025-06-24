import Joi from 'joi';

const passwordSchema = Joi.string()
  .min(8)
  .pattern(
    new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;\"'<>,.?/]).+$")
  )
  .message("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character");

export const userCreateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordSchema.required(),
  name: Joi.string().optional()
});

export const userUpdateSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: passwordSchema.optional(),
  name: Joi.string().optional()
});
