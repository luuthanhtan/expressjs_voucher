import { RequestHandler } from "express";
import { ObjectSchema } from "joi";

export const validateBody = (schema: ObjectSchema): RequestHandler => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};
