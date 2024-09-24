const Joi = require("joi");

const registerUserSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
}

module.exports = registerUserSchema;