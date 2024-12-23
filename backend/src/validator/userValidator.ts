import Joi from 'joi';


export const signUpValidate = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

export const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})