
var jwt = require("jsonwebtoken");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const sendVerificationMail = require("../helper/sendVerificationMail");
const { CustomError } = require("../helper/errorHelper");
const { generateEmailVerificationToken, generateAuthToken, verifyMailToken } = require("../helper/tokenHelper");



const registerUser = async (req, res, next) => {
	const { name, email, password } = req.body;
	try {
		const existUser = await User.findOne({ email });
		if (existUser) throw new CustomError("User already exists with this email", 400)

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		try {
			const token = generateEmailVerificationToken(email)
			sendVerificationMail(email, token);
		} catch (emailError) {
			throw new CustomError("Error in sending verification email", 500)
		}

		await newUser.save();

		const authToken = generateAuthToken(newUser._id)

		return res.status(201).json({
			error: false,
			message: "User registered successfully Please Verify Your Email",
			token: authToken,
			user: newUser,
		});
	} catch (error) {
		next(error)
	}
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email, isEmailVerified: true });
		if (!user) throw new CustomError("User not found", 400)

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) throw new CustomError("Invalid password", 400)

		const token = generateAuthToken(user._id)
		return res
			.status(200)
			.json({ error: false, message: "Login successful", token });
	} catch (error) {
		next(error)
	}
};

const verifyEmail = async (req, res, next) => {
	const { token } = req.query;
	try {
		if (!token) throw new CustomError("Token not provided", 400);
		const email = verifyMailToken(token);
		const user = await User.findOne({ email });
		if (user.isEmailVerified) throw new CustomError("User email already verified", 400)
		if (!user) {
			throw new CustomError("User not found", 404);
		}
		user.isEmailVerified = true;
		await user.save();
		return res.status(200).json({
			error: false,
			message: "Email verification successful"
		});
	} catch (error) {
		if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
			next(new CustomError("Invalid or expired token", 400));
		}
		next(error)
	}
};

const sendEmailVerificationLink = async (req, res, next) => {
	try {
		const email = req.user.email;
		if (req.user.isEmailVerified) throw new CustomError("User Email Already Verified", 400)
		const token = generateEmailVerificationToken(email);
		sendVerificationMail(email, token);

		return res.status(200).json({
			error: false,
			message: "Verification email sent successfully",
		});
	} catch (error) {
		next(error);
	}
};


const getLoggedInUserInfo = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const loggedInUser = await User.findById(loggedInUserId);
		if (!loggedInUser) {
			return res.status(404).json({ Error: true, Message: "User not found" });
		}
		return res.status(200).json({ Error: false, UserInfo: loggedInUser });
	} catch (error) {
		console.error("Error retrieving user information: ", error);
		return res
			.status(500)
			.json({ Error: true, Message: "Internal server error" });
	}
};

module.exports = { registerUser, loginUser, verifyEmail, getLoggedInUserInfo, sendEmailVerificationLink };
