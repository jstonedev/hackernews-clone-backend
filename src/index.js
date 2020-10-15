const { GraphQLServer } = require("graphql-yoga");

// runtime data
let links = [
	{
		id: "link-0",
		url: "www.howtographql.com",
		description: "Fullstack tutorial for GraphQL",
	},
];

// Resolvers
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => links,
	},
};

// Server instantiation
const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
