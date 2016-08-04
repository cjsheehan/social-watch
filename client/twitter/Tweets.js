import { Tweets } from "/collections/Tweets";
import { ReactiveVar } from "meteor/reactive-var";
import { randomInt } from "/lib/util";
import { wordFrequency } from "/lib/modules/wordStats";
import { testTweets } from "./testTweets";
/* eslint-disable no-unused-vars*/
import { WordCloud } from "wordcloud";
/* eslint-enable no-unused-vars*/
const wordcloud = require("wordcloud");

const cloudOptions = {
	gridSize: 100,
	rotateRatio: 1,
	color: "random-dark",
	weightFactor: 3
}

Template.Tweets.onRendered(function () {
	const instance = Template.instance();
	instance.canvas = document.getElementById("canvas");
});

Template.Tweets.onCreated(function () {
	this.counter = new ReactiveVar(0);
    this.testTweets = testTweets;

	var self = this;
	self.autorun(function () {
		self.subscribe("tweets");
	})
});

Template.Tweets.helpers({
	tweets: () => {
		const instance = Template.instance();
		let text = "";
		let tweets = Tweets.find({});
		tweets.forEach(function (tweet) {
			text += tweet.text + " ";
		});
		let words = wordFrequency(text);
		cloudOptions.list = words;
		wordcloud(instance.canvas, cloudOptions);
		return tweets;
	},

	counter() {
		return Template.instance().counter.get();
	},
});

Template.Tweets.events({
	"click button"(event, instance) {
		console.log("button pressed");
		let testTweet = instance.testTweets[randomInt(0, instance.testTweets.length)];
		testTweet.idStr = instance.counter.get();
		console.log(testTweet);
		Tweets.insert(testTweet);
		instance.counter.set(instance.counter.get() + 1);
	},
});
