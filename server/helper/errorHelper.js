const { ValidationError } = require('express-validation');
const constants = require('../config/constants');
class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'Custom Error';
        this.code = code;
    }
}
exports.CustomError = CustomError;
// eslint-disable-next-line no-unused-vars
exports.errorHandler = (error, req, res, _next) => {
    // set locals, only providing error in development
    if (error.status === 404) {
        return res.status(404).json({
            error: true,
            message: 'Not Found',
            errType: constants.ERROR_TYPES.HTTP
        });
    }
    if (error instanceof ValidationError) {
        const validationErrors = {};
        Object.keys(error.details).forEach((key) => {
            const details = error.details[key];
            details.forEach((d) => {
                validationErrors[d.path.join('.')] = d.message;
            });
        });
        return res.status(400).json({
            error: true,
            message: 'Validation Error',
            details: validationErrors,
            errType: constants.ERROR_TYPES.VALIDATION
        });
    }
    if (error instanceof CustomError) {
        error.stack;
        return res.status(200).json({
            error: true,
            message: String(error.message),
            errType: constants.ERROR_TYPES.CUSTOM
        });
    }
    console.log(error);
    return res.status(500).json({
        error: true,
        message:
            req.app.get('env') === 'development'
                ? String(error.message)
                : 'An unexpected Error occured',
        errType: constants.ERROR_TYPES.UNEXPECTED,
        stack: req.app.get('env') === 'development' ? error.stack : undefined
    });
    
};
