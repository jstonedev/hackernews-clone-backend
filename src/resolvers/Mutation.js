const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

// Signup
async function signup(parent, args, context, info) {
	// encrypt user password
	const password = await bcrypt.hash(args.password, 10);

	// create & store new user record in db
	const user = await context.prisma.user.create({
		data: { ...args, password },
	});

	// generate json webToken
	const token = jwt.sign({ userId: user.id }, APP_SECRET);

	// return object that adheres to the authPayload shape in GraphQL schemad
	return {
		token,
		user,
	};
}

// Login
async function login(parent, args, context, info) {
	// retrieve existing User record
	const user = await context.prisma.user.findOne({
		where: { email: args.email },
	});
	if (!user) {
		throw new Error("No such user found");
	}

	// compare provided pw & stored pw
	const valid = await bcrypt.compare(args.password, user.password);
	if (!valid) {
		throw new Error("Invalid password");
	}

	// generate token
	const token = jwt.sign({ userId: user.id }, APP_SECRET);

	// return object resembling authPayload
	return {
		token,
		user,
	};
}

// Post
function post(parent, args, context, info) {
	const userId = getUserId(context);

	return context.prisma.link.create({
		data: {
			url: args.url,
			description: args.description,
			postedBy: { connect: { id: userId } },
		},
	});
}

module.exports = {
	signup,
	login,
	post,
};
