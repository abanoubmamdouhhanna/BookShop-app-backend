import joi from "joi";
import { Types } from "mongoose";
const checkObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ObjectId");
};
export const generalFeilds = {
  id: joi.string().custom(checkObjectId).required(),

  userName: joi.string().required().min(3).max(10).messages({
    "any.required": "username is required",
    "string.empty": "username cant't be empty",
    "string.base": "username should be a type of string!",
    "string.min": "username should be at least 3 characters!",
    "string.max": "username should be at least 10 characters!",
  }),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must be valid!!",
      "string.empty": "Email is not allowed to be empty",
    }),

  age: joi.number().required().min(18).max(80).messages({
    "any.required": "Age is required",
    "number.base": "Age must be number",
    "number.min": " must be greater than or equal to 18",
    "number.max": "Age must be less than or equal to 80",
  }),

  password: joi
    .string()
    .required()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      "string.pattern.base":
        "password must be at least eight characters long, with at least one letter and one number",
    }),

  cPassword: joi.string().required().messages({
    "any.only": "The confirmation password must be the same as the password",
  }),

  gender: joi.required().valid("male", "female").messages({
    "any.only": "Gender must be one of male or female!",
  }),

  name: joi.string().required().min(3).max(100).messages({
    "any.required": "name is required",
    "string.empty": "name cant't be empty",
    "string.base": "name should be a type of string!",
    "string.min": "name should be at least 3 characters!",
    "string.max": "name should be less than 100 characters!",
  }),
  description: joi.string().min(20).required().messages({
    "any.required": "description is required",
    "string.empty": "description cant't be empty",
    "string.base": "description should be a type of string!",
    "string.min": "description should be at least 20 characters!",
  }),
  otp: joi
    .string()
    .alphanum()
    .length(8)
    .required()
    .messages({ "string.length": "Invalid OTP code" }),
};

//////  Validation   ///////////////
export const isValid = (joiSchema) => {
  return (req, res, next) => {
    const copyReq = {
      ...req.body,
      ...req.params,
      ...req.query,
    };
    if (req.headers?.authorization) {
      copyReq.authorization = req.headers.authorization;
    }
    if (req.files || req.file) {
      copyReq.file = req.files || req.file;
    }

    const { error } = joiSchema.validate(copyReq, { abortEarly: false });
    if (error) {
      // return next(new Error(error));
      return res
        .status(400)
        .json({ message: "Validation Error", Error: error.message });
    } else {
      return next();
    }
  };
};
