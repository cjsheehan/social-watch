import { SentimentResults } from "./twitter/Tweets";
const Highcharts = require("highcharts/highstock");

Template.SentimentResults.onCreated(function () {
	var self = this;
	self.autorun(function () {
		self.subscribe("results");
	});
	this.count = 0;
});

Template.SentimentResults.helpers({
	frequency: () => {
		let wordStats = Session.get("activeWordStats");
		let results = [];
		let frequencySeries = [];

		if (wordStats != null && wordStats.hasOwnProperty("frequency")) {
			for (let i = 0; i < 10; i++) {
				if (wordStats.score[i] != null) {
					let word = wordStats.frequency[i][0];
					let res = {
						"word": word,
						"stats": wordStats.words[word]
					}

					results.push(res);
				}
			}
		}

		// console.log("results", JSON.stringify(results));
		Session.set("activeFreqStats", results);
		return results;
	},

	frequencyChart: () => {

		let wordStats = Session.get("activeFreqStats");
		let categories = [];
		let posSeries = [];
		let negSeries = [];
		let scoreSeries = [];

		wordStats.forEach(function (w) {
			categories.push(w.word);
			posSeries.push(w.stats.sentiment.positive.score);
			negSeries.push(w.stats.sentiment.negative.score);
			scoreSeries.push(w.stats.sentiment.score);
		});

		Meteor.defer(function () {
			Highcharts.chart(document.getElementById("frequency-chart"), {
				chart: {
					type: "bar"
				},
				title: {
					text: "Aggregated sentiment for popular words on twitter stream"
				},
				xAxis: [{
					categories: categories,
					reversed: true,
					labels: {
						step: 1
					}
				}, { // mirror axis on right side
						opposite: true,
						reversed: true,
						categories: categories,
						linkedTo: 0,
						labels: {
							step: 1
						}
					}],
				yAxis: {
					title: {
						text: "Sentiment"
					},
					labels: {
						formatter: function () {
							return this.value;
						}
					}
				},

				plotOptions: {
					bar: {
						grouping: false
					}
				},

				tooltip: {
					formatter: function () {
						return "<b>" + "\"" + this.point.category + "\" : " + "</b><br/>" + this.series.name + "Sentiment: " + Highcharts.numberFormat(this.point.y, 0);
					}
				},

				series: [
					{
						name: "Negative",
						data: negSeries,
						color: "#cc0000"
					},
					{
						name: "Positive",
						data: posSeries,
						color: "#00ce00"
					},
					{
						name: "Score",
						data: scoreSeries
					},
				]
			});
		});
	},
	
	scorePos: () => {
		let wordStats = Session.get("activeWordStats");
		let results = [];

		if (wordStats != null && wordStats.hasOwnProperty("score")) {
			for (let i = 0; i < 5 && i < wordStats.score.length; i++) {
				if (wordStats.score[i] != null) {
					let word = wordStats.score[i][0];
					let res = {
						"word": word,
						"stats": wordStats.words[word]
					}
					results.push(res);
				}
			}
		}

		Session.set("activePosStats", results);
		return results;
	},

	scoreNeg: () => {
		let wordStats = Session.get("activeWordStats");
		let results = [];

		if (wordStats != null && wordStats.hasOwnProperty("score")) {
			let start = wordStats.score.length - 1;
			let end = start - 5;
			for (let i = start; i >= end; i--) {
				if (wordStats.score[i] != null) {
					let word = wordStats.score[i][0];
					let res = {
						"word": word,
						"stats": wordStats.words[word]
					}
					results.push(res);
				}
			}
		}
		Session.set("activeNegStats", results);
		return results;
	},

	percentOfTweets: (word) => {
		let wordStats = Session.get("activeWordStats");
		let percent = 0;
		if (wordStats != null && wordStats.words[word] != null) {
			percent = 100 * (wordStats.words[word].frequency / wordStats.numTweets);
		}
		return percent;
	}
});

function populateResultsDb(results) {
	// console.log("Results: " + JSON.stringify(results));
	results.forEach(function (result) {
		SentimentResults.insert(result);
	});
}

const testResults = [
	{
		"carrrrr": {
			sentiment: {
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
			sentiment: {
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
