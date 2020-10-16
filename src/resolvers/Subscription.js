function newLinkSubscribe(parent, args, context, info) {
	// push event data to client
	return context.pubsub.asyncIterator("NEW_LINK");
}

const newLink = {
	subscribe: newLinkSubscribe,
	resolve: (payload) => {
		// data emitted by asyncIterator
		return payload;
	},
};

module.exports = {
	newLink,
};
