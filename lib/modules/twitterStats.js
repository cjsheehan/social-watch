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
		words: {},
		frequency: [],
		score: [],
		numTweets: tweets.length

	};

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

		}

	});

	// TODO : optimise for DRY, should not need to iterate over object wordStats twice

	// create a sentiment ordered object : map words sentiment score to array
	let scoreList = Object.keys(wordStats.words).map(function (word) {
		return [word, wordStats.words[word].sentiment.score];
	});

	wordStats.score = sortDescending(scoreList);
	console.log("scoreList", JSON.stringify(wordStats.score));

	// create a frequency ordered object: map word frequency to array
	let frequencyList = Object.keys(wordStats.words).map(function (word) {
		return [word, wordStats.words[word].frequency];
	});

	wordStats.frequency = sortDescending(frequencyList)
	console.log("frequency", JSON.stringify(wordStats.frequency));

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

