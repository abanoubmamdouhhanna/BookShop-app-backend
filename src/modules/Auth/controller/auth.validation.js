import joi from 'joi'
import { generalFeilds } from '../../../middlewares/validation.middleware.js'

export const authRegisterSchema= joi.object(
    {
        userName: generalFeilds.userName,

        email: generalFeilds.email,

        age:generalFeilds.age,

        password:generalFeilds.password,

        cPassword:generalFeilds.cPassword.valid(joi.ref("password")),

        gender:generalFeilds.gender
    }
).required().unknown(true)

export const logInSchema=joi.object(
    {
        userName:generalFeilds.userName,

        email:generalFeilds.email,

        password:generalFeilds.password
    }
).required().unknown(true)

export const forgetPasswordSchema=joi.object(
    {
        email:generalFeilds.email
    }
).required().unknown(true)

export const resetPasswordSchema=joi.object(
    {
        password:generalFeilds.password
    }
).required().unknown(true)

export const resetPasswordOTPSchema=joi.object(
    {
        userEmail:generalFeilds.email,
        password:generalFeilds.password,
        otp:generalFeilds.otp
    }
).required().unknown(true)