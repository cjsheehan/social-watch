import { Tweets } from "/collections/Tweets";

Meteor.publish("tweets", function () {
	return Tweets.find({}, { sort: { insertedAt: -1 }, limit: 100});
});