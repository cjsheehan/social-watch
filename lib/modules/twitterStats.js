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
		frequency: []
	};

	tweets.forEach(function (tweet) {
		let frequency = wordFrequency(tweet.text, false);

		for (let word in frequency) {
			
			// aggregate word frequency
			addFrequency(wordStats.words, word, frequency[word]);

			// analyse tweet sentiment
			tweet.sentiment = analyse(tweet.text);

			// aggregate sentiment
			if (!wordStats.words[word].sentiment) {
				wordStats.words[word].sentiment = tweet.sentiment;
			} else {
				wordStats.words[word].sentiment = addSentiment(wordStats.words[word].sentiment, tweet.sentiment);
			}

			// setup word -> tweet pointers
			if (!wordStats.words[word].tweets) {
				wordStats.words[word].tweets = [];
			}
			// wordStats.words[word].tweets.push(tweet);
		}

	});

	// map word frequency to array
	let frequencyList = Object.keys(wordStats.words).map(function (word) {
		return [word, wordStats.words[word].frequency];
	});

	// sort by descending frequency
	frequencyList.sort(function (a, b) {
		if (a[1] === b[1]) {
			return 0;
		}
		else {
			return (a[1] > b[1]) ? -1 : 1;
		}
	});

	wordStats.frequency = frequencyList;

	return wordStats;
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

