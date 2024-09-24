const express = require("express");
const route = express.Router();

const {
	registerUser,
	loginUser,
	verifyEmail,
	getLoggedInUserInfo,
} = require("../controller/userController");
const { checkUserAuth } = require("../middlewares/auth-middleware");
const { validate } = require("express-validation");
const registerUserSchema = require("../validation/user");

route.post("/signup", validate(registerUserSchema, {}, {}), registerUser);
route.post("/login", loginUser);
route.post("/verify-email", verifyEmail);
route.get("/getLoggedInUserInfo", checkUserAuth, getLoggedInUserInfo);

module.exports = route;
