import { Tweets } from "/collections/Tweets";
import { ReactiveVar } from "meteor/reactive-var";
import { randomInt } from "/lib/util";
import { testTweets } from "./testTweets";
import { tweetStats, timeStats } from "/lib/modules/twitterStats"
/* eslint-disable no-unused-vars*/
import { WordCloud } from "wordcloud";
/* eslint-enable no-unused-vars*/
import { MAX_RECORDS } from "/lib/constants";

import { MAX_SENTIMENT_ROWS } from "../lib/constants";

const wordcloud = require("wordcloud");

const serverOnly = false;

const weights = {
	min : 1,
	med : 3,
	max : 5
};

const MAX_THRESHOLD = 50;
const ACTIVE_TWEETS = 10;
const MAX_TO_CLOUD = 100;


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
	this.timeStats = {};
	var self = this;
	self.autorun(function () {
		self.subscribe("tweets");
	})
});

Template.Tweets.helpers({
	tweets: () => {
		if (!serverOnly) {
			const instance = Template.instance();
			let tweets = Tweets.find({}, { sort: { insertedAt: -1 }, limit: MAX_RECORDS, reactive: Session.get("reactive")}).fetch();
			
			// cache data model
			let sortBy = Session.get("sortByHashtags");

			this.wordStats = tweetStats(tweets, sortBy);
			Session.set("activeWordStats", this.wordStats);

			this.timeStats = timeStats(tweets, sortBy);
			Session.set("activeTimeStats", this.timeStats);

			// console.log("wordstats\n", JSON.stringify(this.wordStats), "\n\ntimeStats\n", JSON.stringify(this.timeStats));

			// cache most popular words to allow external 
			// select controls to be populated
			let words = this.wordStats.frequency.slice(0, MAX_SENTIMENT_ROWS);
			let topFreqWords = words.map((word) => {
				return word[0];
			})
			Session.set("topActiveWords", topFreqWords);

			// optimise render performance
			let cloudSource = [];
			if(wordStats.frequency.length > MAX_TO_CLOUD) {
				cloudSource = wordStats.frequency.slice(0, MAX_TO_CLOUD);
			} else {
				cloudSource = wordStats.frequency;
			}

			// scale cloud weight as function of top word frequency
			if (cloudSource[0][1] < 10) {
				cloudOptions.weightFactor = 10;
			}
			else if (cloudSource[0][1] < 20) {
				cloudOptions.weightFactor = 8;
			} else if (cloudSource[0][1] < 50) {
				cloudOptions.weightFactor = 5;
			} else {
				cloudOptions.weightFactor = 1;
			}

			cloudOptions.list = cloudSource;
			wordcloud(instance.canvas, cloudOptions);

			// only provide subset for viweing twitter stream
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
