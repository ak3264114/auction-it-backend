const jwt = require('jsonwebtoken');

exports.generateEmailVerificationToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_VERIFY_MAIL_SECRET_KEY, { expiresIn: "15m", });
};

exports.generateAuthToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_ACCESS_KEY, { expiresIn: '7d' });
};

exports.verifyMailToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_VERIFY_MAIL_SECRET_KEY);
    return decoded.email;
};