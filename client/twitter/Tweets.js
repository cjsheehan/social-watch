import { Tweets } from "/collections/Tweets";

Template.Tweets.onCreated(function () {
	var self = this;
	self.autorun(function () {
		self.subscribe("tweets");
	})
});

Template.Tweets.helpers({
	tweets: () => {
		return Tweets.find({});
	}
});