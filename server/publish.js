import { Tweets, SearchResults } from "/collections/Tweets";
import { MAX_RECORDS } from "/lib/constants";

Meteor.publish("tweets", function () {
	return Tweets.find({}, { sort: { insertedAt: -1 }, limit: MAX_RECORDS });
});

Meteor.publish("searchResults", function () {
	return SearchResults.find({}, { sort: { createdAt: -1 } });
});