const { GraphQLServer } = require("graphql-yoga");
const { PrismaClient } = require("@prisma/client");

// Resolvers
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => async (parent, args, context) => {
			return context.prisma.link.findMany();
		},
		link: (parent, { id }, context) => {
			const link = context.prisma.link.find((link) => link.id === id);
			return link;
		},
	},
	Mutation: {
		post: (parent, args, context) => {
			const newLink = context.prisma.link.create({
				data: {
					url: args.url,
					description: args.description,
				},
			});
			return newLink;
		},
		updateLink: (parent, args, context) => {
			const links = context.prisma.link.findMany();
			links.forEach((link) => {
				if (link.id === args.id) {
					link.id = args.id;
					link.url = args.url;
					link.description = args.description;
				}
				return link;
			});
		},
		deleteLink: (parent, { id }, context) => {
			const links = context.prisma.link.findMany();
			const index = links.findIndex((link) => link.id === id);
			const link = links[index];
			links.splice(index, 1);
			return link;
		},
	},
};

const prisma = new PrismaClient();

// Server instantiation
const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
	context: {
		prisma,
	},
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
