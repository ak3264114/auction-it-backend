var User = require("../model/user");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

exports.checkUserAuth = async (req, res, next) => {
	let token;
	const { authorization } = req.headers;

	if (authorization && authorization.startsWith("token")) {
		token = authorization.split(" ")[1];
		try {
			const { id } = jwt.verify(token, process.env.JWT_ACCESS_KEY);
			req.user = await User.findById(id).select("-password");

			if (req.user) {
				return next();
			} else {
				return res.status(401).json({
					error: "true",
					message: "Unauthorized User",
				});
			}
		} catch (error) {
			return res.status(401).json({
				error: "true",
				message: error.message || "Unauthorized User",
			});
		}
	}

	return res.status(401).json({
		error: "true",
		message: "Unauthorized User, No token",
	});
};