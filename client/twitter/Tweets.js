import { Tweets } from "/collections/Tweets";
import { ReactiveVar } from "meteor/reactive-var";
import { randomInt } from "/lib/util";
import { testTweets } from "./testTweets";
import { tweetStats } from "/lib/modules/twitterStats"
/* eslint-disable no-unused-vars*/
import { WordCloud } from "wordcloud";
/* eslint-enable no-unused-vars*/

const wordcloud = require("wordcloud");

const serverOnly = false;

const weights = {
	min : 1,
	med : 3,
	max : 5
};

const WEIGHT_THRESHOLD = 50;
const ACTIVE_TWEETS = 10;
const MAX_RECORDS = 100;


const cloudOptions = {
	gridSize: 60,
	rotateRatio: 1,
	color: "random-dark",
	weightFactor: 1
}

Template.Tweets.onRendered(function () {
	const instance = Template.instance();
	instance.canvas = document.getElementById("canvas");
});

Template.Tweets.onCreated(function () {
	Session.set("sortByHashtags", false);
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
		if (!serverOnly) {
			const instance = Template.instance();
			let tweets = Tweets.find({}, { sort: { insertedAt: -1 }, limit: 100}).fetch();
			
			this.wordStats = tweetStats(tweets, Session.get("sortByHashtags"));
			Session.set("activeWordStats", this.wordStats);

			let cloudSource = wordStats.frequency;
			if (cloudSource[0][1] < WEIGHT_THRESHOLD) {
				cloudOptions.weightFactor = weights.max;
			} else {
				cloudOptions.weightFactor = weights.min;
			}
			cloudOptions.list = cloudSource;
			wordcloud(instance.canvas, cloudOptions);
			let subset = [];
			let len = tweets.length;
			for (var i = 0; i < ACTIVE_TWEETS && i < len; i++) {
				subset[i] = tweets[i];
			}
			return subset;
		} else {
			return [];
		}
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
