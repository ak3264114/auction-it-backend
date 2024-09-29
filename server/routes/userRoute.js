const express = require("express");
const route = express.Router();

const {
	registerUser,
	loginUser,
	verifyEmail,
	getLoggedInUserInfo,
	sendEmailVerificationLink,
} = require("../controller/userController");
const { checkUserAuth } = require("../middlewares/auth-middleware");
const { validate } = require("express-validation");
const { registerUserSchema, loginUserSchema, verifyEmailSchema } = require("../validation/user");

route.post("/signup", validate(registerUserSchema, {}, {}), registerUser);
route.post("/login", validate(loginUserSchema, {}, {}), loginUser);
route.post("/verify-email", validate(verifyEmailSchema, {}, {}), verifyEmail);
route.get("/getLoggedInUserInfo", checkUserAuth, getLoggedInUserInfo);
route.post("/generate-email-verification-link", checkUserAuth, sendEmailVerificationLink);

module.exports = route;
