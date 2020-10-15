const { GraphQLServer } = require("graphql-yoga");

// Types
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    post(url: String!, description: String!): Link!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

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

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
