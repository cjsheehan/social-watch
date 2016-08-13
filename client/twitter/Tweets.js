import { Tweets } from "/collections/Tweets";
import { ReactiveVar } from "meteor/reactive-var";
import { randomInt } from "/lib/util";
import { wordFrequency } from "/lib/modules/wordStats";
import { testTweets } from "./testTweets";
import { tweetStats } from "/lib/modules/twitterStats"

/* eslint-disable no-unused-vars*/
import { WordCloud } from "wordcloud";
/* eslint-enable no-unused-vars*/
const wordcloud = require("wordcloud");

export const SentimentResults = new Mongo.Collection(null);

const cloudOptions = {
	gridSize: 100,
	rotateRatio: 1,
	color: "random-dark",
	weightFactor: 2
}

Template.Tweets.onRendered(function () {
	const instance = Template.instance();
	instance.canvas = document.getElementById("canvas");
});

Template.Tweets.onCreated(function () {
	this.counter = new ReactiveVar(0);
	this.testTweets = testTweets;
	this.wordStats = {};
	var self = this;
	self.autorun(function () {
		self.subscribe("tweets");
	})
});

Template.Tweets.helpers({
	tweets: () => {
		const instance = Template.instance();
		let tweets = Tweets.find({}).fetch().reverse();
		this.wordStats = tweetStats(tweets);
		Session.set("activeWordStats", this.wordStats);
		cloudOptions.list = this.wordStats.frequency;
		wordcloud(instance.canvas, cloudOptions);
		let subset = [];
		let len = tweets.length;
		for (var i = 0; i < 10 || i < len; i++) {
			subset[i] = tweets[i];
		}
		return subset;
	},

	counter() {
		return Template.instance().counter.get();
	},
});

Template.Tweets.events({
	"click button"(event, instance) {
		let testTweet = instance.testTweets[randomInt(0, instance.testTweets.length)];
		testTweet.idStr = instance.counter.get();
		Tweets.insert(testTweet);
		instance.counter.set(instance.counter.get() + 1);
	},
});
