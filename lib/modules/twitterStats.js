import { analyse } from "./sentiment";
import { wordFrequency } from "./wordStats";

export const SENTIMENT = "sentiment";
export const FREQUENCY = "frequency";
export const TWEET = "tweet";

export function tweetStats(tweets) {
	if (tweets == null) {
		throw new Error("tweetStats() requires valid tweets argument");
	}

	let wordStats = {
		words: {}, 			// full stats object
		frequency: [], 		// sorted by frequency [[word, frequency]...]
		hashtags: [],		// sorted by hashtag frequency [[word, frequency]...]
		score: [], 			// sorted by score [[word, score]...]
		comparative: [], 	// sorted by comparative [[word, comparative]...]
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
		}
	});

	// TODO : optimise for DRY, should not need to iterate over object wordStats > 1 time

	let scoreList = [],
		frequencyList = [],
		comparativeList = [];

	// iterate over words and generate sorted lists with attributes: score, frequency, comparative
	Object.keys(wordStats.words).map(function (word) {
		scoreList.push([word, wordStats.words[word].sentiment.score]);
		frequencyList.push([word, wordStats.words[word].frequency]);
		comparativeList.push([word, wordStats.words[word].sentiment.comparative])

		// calculate % of tweets for each word
		wordStats.words[word].percent = (wordStats.words[word].frequency / wordStats.numTweets) * 100;
	});

	wordStats.score = sortDescending(scoreList);
	wordStats.frequency = sortDescending(frequencyList)
	wordStats.comparative = sortDescending(comparativeList)

	// create a frequency ordered list of hashtags: map tag frequency to array
	let hashTagList = Object.keys(hashtags).map(function (tag) {
		return [tag, hashtags[tag]];
	});

	wordStats.hashtags = sortDescending(hashTagList)

	return wordStats;
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

	// TODO: need to handle tweets with 0 sentiment, they should impact comparatives
	// due to numTokens increase

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

