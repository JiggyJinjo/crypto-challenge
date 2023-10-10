import Joi from "joi";
import { RequestHandler } from "express";

export const transferInput = {
  amount: Joi.number().min(0).required(),
  recipientId: Joi.string().required(),
  senderId: Joi.string().required(),
};

export const validateTransferInput: RequestHandler = async (req, res, next) => {
  try {
    const { error } = Joi.object(transferInput).validate(req.body);

    if (error && error.message) {
      throw new Error(error.message);
    }

    return next();
  } catch (e) {
    res.status(400);
    res.send((e as Joi.ValidationError).message);
  }
};
