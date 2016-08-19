import { Tweets, SearchResults } from "/collections/Tweets";

Meteor.publish("tweets", function () {
	return Tweets.find({}, { sort: { insertedAt: -1 }, limit: 500 });
});

Meteor.publish("searchResults", function () {
	return SearchResults.find({}, { sort: { createdAt: -1 } });
});