function newLinkSubscribe(parent, args, context, info) {
	// push event data to client
	return context.pubsub.asyncIterator("NEW_LINK");
}

function newVoteSubscribe(parent, args, context, info) {
	return context.pubsub.asyncIterator("NEW_VOTE");
}

const newLink = {
	subscribe: newLinkSubscribe,
	resolve: (payload) => {
		// data emitted by asyncIterator
		return payload;
	},
};

const newVote = {
	subscribe: newVoteSubscribe,
	resolve: (payload) => {
		return payload;
	},
};

module.exports = {
	newLink,
	newVote,
};
