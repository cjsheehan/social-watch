import { MAX_SENTIMENT_ROWS } from "./lib/constants";
const Highcharts = require("highcharts/highstock");

Template.SingleResult.helpers({

	id: (attribute) => {
		return "id=\"" + attribute + "-chart\"";
	},

	sentiment: (attribute, isPositive = true) => {
		// wordStats[attribute] is sorted descending list wrt attribute
		let wordStats = Session.get("activeWordStats");
		let results = [];

		if (wordStats != null && wordStats.hasOwnProperty([attribute])) {
			if (isPositive) {
				// iterate forward in array
				for (let i = 0; i < MAX_SENTIMENT_ROWS && i < wordStats[attribute].length; i++) {
					if (wordStats.score[i] != null) {
						let word = wordStats[attribute][i][0];
						let res = {
							"word": word,
							"stats": wordStats.words[word]
						}
						results.push(res);
					}
				}
			} else {
				// iterate backwards in array
				let start = wordStats[attribute].length - 1;
				let end = start - MAX_SENTIMENT_ROWS;
				for (let i = start; i > end && i >= 0; i--) {
					if (wordStats[attribute][i] != null) {
						let word = wordStats[attribute][i][0];
						let res = {
							"word": word,
							"stats": wordStats.words[word]
						}
						results.push(res);
					}
				}
			}
		}
		Session.set((attribute + "Stats"), results);
		return results;
	},

	chart: (attribute) => {

		let wordStats = Session.get(attribute + "Stats");
		let categories = [];
		let posSeries = [];
		let negSeries = [];
		let scoreSeries = [];

		if (wordStats == null) { return; }

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
						return "<b>" + "\"" + this.point.category + "\" : " + "</b><br/>" + this.series.name + " Sentiment: " + Highcharts.numberFormat(this.point.y, 0);
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
						name: "Overall",
						data: scoreSeries
					},
				]
			});
		});
	},
});

