import { analyze } from "Sentimental";
import { wordFrequency } from "./wordStats";

export const SENTIMENT = "sentiment";
export const FREQUENCY = "frequency";
export const TWEET = "tweet";

export function tweetStats(tweets) {
	if (tweets == null) {
		throw new Error("tweetStats() requires valid tweets argument");
	}

	let wordStats = {};

	tweets.forEach(function (tweet) {
		let frequency = wordFrequency(tweet.text, false);
		// console.log("freq:" + JSON.stringify(frequency));

		for (let word in frequency) {

			// aggregate word frequency
			addFrequency(wordStats, word, frequency[word]);

			// analyse tweet sentiment
			tweet.sentiment = analyze(tweet.text);

			// aggregate sentiment
			console.log("tweet:", tweet.text);
			if (!wordStats[word][SENTIMENT]) {
				wordStats[word][SENTIMENT] = tweet.sentiment;
			} else {
				wordStats[word][SENTIMENT] = addSentiment(wordStats[word][SENTIMENT], tweet.sentiment);
			}

			// console.log("sentiment:" + JSON.stringify(wordStats[word][SENTIMENT]));
			// // setup word -> tweet pointers
			// wordStats.word.tweets.push(tweet);
		}

		// // map to array
		// let frequencyList = Object.keys(wordStats).map(function (word) {
		// 	return [word, wordStats.word.frequency];
		// });

		// console.log("frequencyList post map: " + JSON.stringify(frequencyList));

		// // sort by descending frequency
		// frequencyList.sort(function (a, b) {
		// 	if (a[1] === b[1]) {
		// 		return 0;
		// 	}
		// 	else {
		// 		return (a[1] > b[1]) ? -1 : 1;
		// 	}
		// });

		// console.log("frequencyList post sort: " + JSON.stringify(frequencyList));

	});
	console.log("stats" + JSON.stringify(wordStats));
	return wordStats;
}

export function addFrequency(words, word, frequency) {
	if (words == null || word == null || frequency == null) {
		throw new Error("addOccurence() requires 3 valid arguments");
	}

	if (!words[word]) {
		words[word] = { frequency: 0 };
	}
	words[word]["frequency"] += frequency;
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
	let aNumTokens = getNumTokens(a.score, a.comparative);
	let bNumTokens = getNumTokens(b.score, b.comparative);
	let numTokens = aNumTokens + bNumTokens;

	// TODO: need to handle tweets with 0 sentiment, they should impact comparatives
	// due to numTokens increase

	// comparatives
	let comparative = getComparative(score, numTokens);
	positive.comparative = a.positive.comparative + b.positive.comparative;
	negative.comparative = a.negative.comparative + b.negative.comparative;

	let aggregate = { score, comparative, numTokens, positive, negative };

	console.log("aggregate:", aggregate);
	return aggregate;
}

function getNumTokens(score, comparative) {
	let numTokens = score / comparative;
	if (numTokens == null || isNaN(numTokens)) {
		numTokens = 0;
	}
	return numTokens;
}

function getComparative(score, numTokens) {
	let comparative = score / numTokens;
	if (comparative == null || isNaN(comparative)) {
		comparative = 0;
	}

	return comparative;
}

