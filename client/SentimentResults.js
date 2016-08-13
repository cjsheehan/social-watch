import { SentimentResults } from "./twitter/Tweets";

Template.SentimentResults.onCreated(function () {
	var self = this;
	self.autorun(function () {
		self.subscribe("results");
	});
	this.count = 0;
	// console.log("testResults: " + testResults);
	// populateResultsDb(testResults);
	// let cursor = SentimentResults.find({});
	// console.log(JSON.stringify(res));
	// console.log("results from db: " + JSON.stringify(res));
	// cursor.forEach(function(row) {
	// 	console.log(row.word);
	// });

});

Template.SentimentResults.helpers({
	frequency: () => {
		let wordStats = Session.get("activeWordStats");
		let results = [];

		if (wordStats != null && wordStats.hasOwnProperty("frequency")) {
			for (let i = 0; i < 10; i++) {
				let word = wordStats.frequency[i][0];
				let res = {
					"word": word,
					"stats": wordStats.words[word]
				}
				results.push(res);
			}
		}
		return results;
	},

	scorePos: () => {
			let wordStats = Session.get("activeWordStats");
			let results = [];

			if (wordStats != null && wordStats.hasOwnProperty("score")) {
				for (let i = 0; i < 5 && i < wordStats.score.length; i++) {
					let word = wordStats.score[i][0];
					let res = {
						"word": word,
						"stats": wordStats.words[word]
					}
					results.push(res);
				}
			}
			return results;
	},

	scoreNeg: () => {
		let wordStats = Session.get("activeWordStats");
		let results = [];

		if (wordStats != null && wordStats.hasOwnProperty("score")) {
			let start = wordStats.score.length - 1;
			let end = start - 5;
			for (let i = start; i >= end; i--) {
				let word = wordStats.score[i][0];
				let res = {
					"word": word,
					"stats": wordStats.words[word]
				}
				results.push(res);
			}
		}
		return results;
	}
});

function populateResultsDb(results) {
	// console.log("Results: " + JSON.stringify(results));
	results.forEach(function(result) {
		SentimentResults.insert(result);
	});
}

const testResults = [
	{
		"carrrrr": {
			sentiment : {
				score: 6,
				comparative: 1.25,
				positive: {
					score: 8,
					comparative: 1.25,
				},
				negative: {
					score: -3,
					comparative: 1.25,
				}
			}
		},

	},
	{
		"toy": {
			sentiment : {
				score: 6,
				comparative: 1.25,
				positive: {
					score: 8,
					comparative: 1.25,
				},
				negative: {
					score: -3,
					comparative: 1.25,
				}
			}
		},

	},
];
