import Joi from "joi";
import { RequestHandler } from "express";

export const createUserInputValidator = {
  name: Joi.string().required(),
  balance: Joi.number().min(0).required(),
};

export const getUserInputValidator = {
  userId: Joi.string().required(),
};

export const validateGetUserInput: RequestHandler = async (req, res, next) => {
  try {
    const { error } = Joi.object(getUserInputValidator).validate(req.params);

    if (error && error.message) {
      throw new Error(error.message);
    }

    return next();
  } catch (e) {
    res.status(400);
    res.send((e as Joi.ValidationError).message);
  }
};

export const validateCreateUserInput: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const { error } = Joi.object(createUserInputValidator).validate(req.body);

    if (error && error.message) {
      throw new Error(error.message);
    }

    return next();
  } catch (e) {
    res.status(400);
    res.send((e as Joi.ValidationError).message);
  }
};
