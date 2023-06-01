import joi from "joi"; 
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const updateUserSchema=joi.object(
    {
        age:generalFeilds.age
    }
).required()

export const changePasswordSchema=joi.object(
    {
        oldPassword:generalFeilds.password,
        newPassword:generalFeilds.password
    }
).required()