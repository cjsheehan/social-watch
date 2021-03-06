import { analyse } from "./sentiment";
import { wordFrequency } from "./wordStats";
import { sortByDate, parseTwitterDate, isBetween } from "/lib/util";
import { CAT_FORMAT, BIN_SIZE, BIN_UNIT, MAX_TIME, MAX_TIME_UNIT } from "/lib/constants";


const moment = require("moment");

export const SENTIMENT = "sentiment";
export const FREQUENCY = "frequency";
export const TWEET = "tweet";


export function tweetStats(tweets, sortByHashtags) {
	if (tweets == null) {
		throw new Error("tweetStats() requires valid tweets and sortByHashtags arguments");
	}

	// sorted arrays have a target of "words" or "hashtags" wrt sortByHashtags param
	let wordStats = {
		words: {}, 			// full stats object, each word has a sentiment hierarchy
		frequency: [], 		// sorted by frequency [[target, frequency]...]
		score: [], 			// sorted by score [[target, score]...]
		comparative: [], 	// sorted by comparative [[target, comparative]...]
		numTweets: tweets.length
	};

	let hashtags = {};

	tweets.forEach(function (tweet) {

		// get word frequency
		let frequency = wordFrequency(tweet.text, false);

		// analyse tweet sentiment
		tweet.sentiment = analyse(tweet.text);

		for (let word in frequency) {

			// aggregate word frequency
			addFrequency(wordStats.words, word, frequency[word]);

			// aggregate sentiment
			if (!wordStats.words[word].sentiment) {
				wordStats.words[word].sentiment = tweet.sentiment;
			} else {
				wordStats.words[word].sentiment = addSentiment(wordStats.words[word].sentiment, tweet.sentiment);
			}

			// cache number of tweets associated with word
			if (!wordStats.words[word].numTweets) {
				wordStats.words[word].numTweets = 0;
			}

			wordStats.words[word].numTweets += 1;

			// cache hashtags if available
			if (word.search(/^#\S+$/) !== -1) {
				if (!hashtags[word]) {
					hashtags[word] = 0;
				}
				hashtags[word] += 1;
			}

			// setup tweet pointers for post processing of time domain
			if (!wordStats.words[word].tweets) {
				wordStats.words[word].tweets = [];
			}
		}
	});

	let scoreList = [],
		frequencyList = [],
		comparativeList = [];

	// choose the sorting source wrt to target param
	let sortingSource = [];
	if (sortByHashtags === true) {
		sortingSource = hashtags;
	} else {
		sortingSource = wordStats.words
	}

	// iterate over target and generate sorted lists with attributes: score, frequency, comparative
	Object.keys(sortingSource).map(function (key) {
		scoreList.push([key, wordStats.words[key].sentiment.score]);
		frequencyList.push([key, wordStats.words[key].frequency]);
		comparativeList.push([key, wordStats.words[key].sentiment.comparative])

		// calculate % of tweets for each word
		wordStats.words[key].percent = (wordStats.words[key].frequency / wordStats.numTweets) * 100;
	});
	
	// sort the key attribute lists
	wordStats.score = sortDescending(scoreList);
	wordStats.frequency = sortDescending(frequencyList)
	wordStats.comparative = sortDescending(comparativeList)

	return wordStats;
}

export function timeStats(tweets, sortByHashtags) {
	let bins = timeBins(tweets);
	tweets.forEach(function (tweet) {
		for (var i = 0; i < bins.length; i++) {
			// if the tweet was created within bin timeframe, then add the tweet to bin :
			// .isBetween(start, end) is inclusive
			let createdAt = moment(tweet.createdAt);
			if (createdAt.isBetween(bins[i].start, bins[i].end, null, "[]")) {
				bins[i].tweets.push(tweet);
				break;
			}
		}
	});

	// get stats/analysis for each bin
	bins.forEach(function(bin){
		let stats = tweetStats(bin.tweets, false);
		bin.stats = stats;
		// improve memory management
		bin.tweets = []; 
		// allow serialisation by converting moment to data
		// bin.start = bin.start.toDate()  
		// bin.end = bin.end.toDate() 
	});

	return bins;
}

export function timeBins(tweets) {
	if (tweets == null) {
		throw new Error("createTimeBins requires valid tweets argument");
	}
	let dateFormat = "dd MMM DD YYYY DD HH:mm:ss " // Fri Jul 29 2016 19:27:18 GMT+ 0100"" "dd MMM DD HH:mm:ss ZZ YYYY";
	let dates = tweets.map(function (tweet) { return parseTwitterDate(tweet.createdAt); });
	let maxDate = new Date(Math.max.apply(null, dates));
	let minDate = new Date(Math.min.apply(null, dates));

	let end = maxDate;
	let bins = [];
	let isBeforeMin = false;
	let last = end;
	let current = end;

	let maxEnd = moment(maxDate).subtract(MAX_TIME, MAX_TIME_UNIT);

	// bins are divided in to individual hours:  recent -> last
	do {
		current = moment(last).subtract(BIN_SIZE, BIN_UNIT).toDate();
		bins.push(new Bin(current, last));
		if (moment(current).isBefore(minDate)) {
			isBeforeMin = true;
		}
		last = current;

	} while (!isBeforeMin && moment(current).isAfter(maxEnd)); // later than minDate or maxEnd

	return bins;

}

let Bin = function(start, end) {
	this.start = start;
	this.end = end;
	this.tweets = [];
	this.stats = {};
}

function sortDescending(list) {
	return list.sort(function (a, b) {
		if (a[1] === b[1]) {
			return 0;
		}
		else {
			return (a[1] > b[1]) ? -1 : 1;
		}
	});
}

export function addFrequency(words, word, frequency) {
	if (words == null || word == null || frequency == null) {
		throw new Error("addOccurence() requires 3 valid arguments");
	}

	if (!words[word]) {
		words[word] = { frequency: 0 };
	}
	words[word].frequency += frequency;
}

export function addSentiment(a, b) {
	if (a == null || b == null) {
		throw new Error("addSentiment() requires 2 valid sentiment objects");
	}

	let positive = {};
	let negative = {};

	// scores
	let score = a.score + b.score;
	positive.score = a.positive.score + b.positive.score;
	negative.score = a.negative.score + b.negative.score;

	// tokens
	let numTokens = a.numTokens + b.numTokens;

	// comparatives
	let comparative = getComparative(score, numTokens);
	positive.comparative = a.positive.comparative + b.positive.comparative;
	negative.comparative = a.negative.comparative + b.negative.comparative;
	let aggregate = { score, comparative, numTokens, positive, negative };

	return aggregate;
}

export function tokenise(text) {
	let tokens = text.replace(/\s+/g, " ").split(" ");
	return tokens;
}

function getComparative(score, numTokens) {
	let comparative = score / numTokens;
	if (comparative == null || isNaN(comparative)) {
		comparative = 0;
	}
	return comparative;
}

