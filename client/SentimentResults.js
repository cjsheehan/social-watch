import { SentimentResults } from "./twitter/Tweets";

Template.SentimentResults.onCreated(function () {
	var self = this;
	self.autorun(function () {
		self.subscribe("results");
	})
	// console.log("testResults: " + testResults);
	populateResultsDb(testResults);
	let cursor = SentimentResults.find({});
	// console.log(JSON.stringify(res));
	// console.log("results from db: " + JSON.stringify(res));
	cursor.forEach(function(row) {
		console.log(row.word);
	});

});

Template.SentimentResults.helpers({
	results: () => {
		let results = SentimentResults.find({});
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
		word: "carrrrrrrrrrrrrrrrrrrr",
		score: 6,
		comparative: 1.25,
		positive: 8,
		negative: 2
	},
	{
		word: "toy",
		score: 3,
		comparative: 1.25,
		positive: 5,
		negative: 2
	},
];
