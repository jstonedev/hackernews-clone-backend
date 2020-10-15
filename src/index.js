const { GraphQLServer } = require("graphql-yoga");

// runtime data
let links = [
	{
		id: "link-0",
		url: "www.howtographql.com",
		description: "Fullstack tutorial for GraphQL",
	},
];

let idCount = links.length;

// Resolvers
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => links,
		link: (root, { id }) => {
			const link = links.find((link) => link.id === id);
			return link;
		},
	},
	Mutation: {
		post: (root, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url,
			};
			links.push(link);
			return link;
		},
		updateLink: (root, args) => {
			links.forEach((link) => {
				if (link.id === args.id) {
					link.id = args.id;
					link.url = args.url;
					link.description = args.description;
				}
				return link;
			});
		},
		deleteLink: (root, { id }) => {
			const index = links.findIndex((link) => link.id === id);
			const link = links[index];
			links.splice(index, 1);
			return link;
		},
	},
};

// Server instantiation
const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
