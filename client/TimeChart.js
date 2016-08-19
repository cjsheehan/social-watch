const Highcharts = require("highcharts/highstock");

const moment = require("moment");

Template.TimeChart.onCreated(function () {
	this.topWords = new ReactiveVar(["the", "pulldown", "test"]);
});

Template.TimeChart.helpers({

	topWords: () => {
		return Session.get("topActiveWords");
	},

	chart: () => {

		let timeBins = Session.get("activeTimeStats");
		let categories = [];
		let posSeries = [];
		let negSeries = [];
		let sumSeries = [];
		let decimalPlaces = 0;

		if (timeBins == null) { return; }

		let word = this.selectedWord;

		for (var i = 0; i < timeBins.length; i++) {
			var bin = timeBins[i];
			let time = moment(bin.end).format("HH:mm").toString();
			categories.push(time);
			if (bin.stats.words[word]) {
				posSeries.push(bin.stats.words[word].sentiment.positive.score);
				negSeries.push(bin.stats.words[word].sentiment.negative.score)
				sumSeries.push(bin.stats.words[word].sentiment.score);
			} else {
				posSeries.push(0);
				negSeries.push(0);
				sumSeries.push(0);
			}
		}

		Meteor.defer(function () {
			Highcharts.chart(document.getElementById("time-chart"), {
				chart: {
					type: "column",
					// Edit chart spacing
					spacingBottom: 10,
					spacingTop: 10,
					spacingLeft: 10,
					spacingRight: 10,

					// Explicitly tell the width and height of a chart
					width: 900,
					height: null
				},

				title: {
					text: "\"" + word + "\" score vs time"
				},

				xAxis: {
					categories: categories,
					reversed: true,
					labels: {
						step: 1
					}
				},

				yAxis: {
					title: {
						text: "score (sentiment)"
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


				series: [
					{
						name: "Negative",
						data: negSeries,
						color: "#cc0000",
					},
					{
						name: "Positive",
						data: posSeries,
						color: "#00ce00",
					},
					{
						name: "Overall",
						data: sumSeries
					},
				]
			});
		});
	}
});
