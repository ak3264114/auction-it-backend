const Joi = require("joi");

exports.registerUserSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
}
exports.loginUserSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
}
exports.verifyEmailSchema = {
    query: Joi.object({
        token: Joi.string().required(),
    })
}