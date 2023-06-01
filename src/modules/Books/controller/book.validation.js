import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const addBookSchema = joi
  .object({
    name: generalFeilds.name,
    description: generalFeilds.description,
  })
  .required()
  .unknown(true);

export const updateBookSchema = joi
  .object({
    name: generalFeilds.name,
    description: generalFeilds.description,
  })
  .required()
  .unknown(true);
