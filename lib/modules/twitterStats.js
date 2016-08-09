import { analyze } from "Sentimental";

export function evalStats(tweets) {
	if (wordFrequency == null || tweets == null) {
		throw new Error("TwitStats.evalStats() requires 2 arguments");
	}

	let wordStats = [];

	tweets.forEach(function (tweet) {
		let frequency = wordFrequency(tweet, false);

		for (let word in frequency) {

			addOccurence(wordStats, word, frequency[word]);

			// aggregate sentiment
			tweet.sentiment = analyze(tweet);
			wordStats.word.sentiment = addSentiment(wordStats.word.sentiment, tweet.sentiment);

			// setup word -> tweet pointers
			wordStats.word.tweets.push(tweet);

		}

		// map to array
		let mapped = Object.keys(wordStats).map(function (word) {
			return [word, wordStats.word.frequency];
		});

		// sort by descending frequency
		mapped.sort(function (a, b) {
			if (a[1] === b[1]) {
				return 0;
			}
			else {
				return (a[1] > b[1]) ? -1 : 1;
			}
		});

	});

	return { wordStats, mapped, tweets };
}

function addOccurence(words, word, frequency) {
	if (words == null || word == null || frequency == null) {
		throw new Error("addOccurence() requires 3 valid arguments");
	}

	if (!words[word]) {
		words[word].frequency = 0;
	}
	words[word].frequency += frequency[word];

}

export function addSentiment(a, b) {
	if (a == null || b == null) {
		throw new Error("addSentiment() requires 2 valid sentiment objects");
	}
	let score = a.score + b.score;
	let aNumTokens = a.score / a.comparative;
	let bNumTokens = b.score / b.comparative;
	let comparative = score / (aNumTokens + bNumTokens);
	let positive = a.positive.score + b.positive.score;
	let negative = a.negative.score - b.negative.score;
	return { score, comparative, positive, negative };
}

