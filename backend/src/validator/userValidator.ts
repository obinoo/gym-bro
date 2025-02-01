import Joi from 'joi';


export const signUpValidate = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    weightInKg: Joi.number().required(),
    heightInCm: Joi.number().required(),
    gender: Joi.string().required(),
    dob: Joi.string().required(),
    goal: Joi.string().required(),
    activityLevel: Joi.string().required()
})

export const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})