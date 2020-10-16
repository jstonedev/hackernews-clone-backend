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

	const newLink = context.prisma.link.create({
		data: {
			url: args.url,
			description: args.description,
			postedBy: { connect: { id: userId } },
		},
	});
	context.pubsub.publish("NEW_LINK", newLink);

	return newLink;
}

// Vote
function Vote(parent, args, context, info) {

	// validate incoming JWT
	const userId = getUserId(context)
	
	// look for existing vote
	const vote = await context.prisma.vote.findOne({
		where: {
			linkId_userId: {
				linkId: Number(args.linkId),
				userId: userId
			}
		}
	})

	// if vote exists, send error msg
	if (Boolean(vote)) {
		throw new Error(`Already voted for link: ${args.linkId}`)
	}

	// create new vote connected to user & link
	const newVote = context.prisma.vote.create({
		data: {
			user: { connect: { id: userId } },
			link: { connect: { id: Number(args.linkId) } },
		}
	})

	context.pubsub.publish("NEW_VOTE", newVote)

	return newVote
}

module.exports = {
	signup,
	login,
	post,
	vote
};
