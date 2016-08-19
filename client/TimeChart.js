const Highcharts = require("highcharts/highstock");

const moment = require("moment");

Template.TimeChart.onCreated(function () {
	let words = Session.get("topActiveWords");
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
		let freqSeries = [];

		if (timeBins == null) { return; }

		let word = Session.get("selectedWord");

		for (var i = 0; i < timeBins.length; i++) {
			var bin = timeBins[i];
			let time = moment(bin.end).format("HH:mm").toString();
			categories.push(time);
			if (bin.stats.words[word]) {
				posSeries.push(bin.stats.words[word].sentiment.positive.score);
				negSeries.push(bin.stats.words[word].sentiment.negative.score)
				sumSeries.push(bin.stats.words[word].sentiment.score);
				freqSeries.push(bin.stats.words[word].numTweets);
			} else {
				posSeries.push(0);
				negSeries.push(0);
				sumSeries.push(0);
				freqSeries.push(0);
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
					height: null,
					zoomType: "xy"
				},

				title: {
					text: "\"" + word + "\" score vs time"
				},

				xAxis: {
					type: "datetime",
					categories: categories,
					reversed: true,
					labels: {
						step: 1
					}
				},

				tooltip: {
					shared: true
				},

				yAxis: [{ // Primary yAxis
					title: {
						text: "score (sentiment)"
					},
					labels: {
						formatter: function () {
							return this.value;
						}
					}
				}, {
					title: {
						text: "\"" + word + "\"" + " Occurences",
						style: {
							color: "#191919"
						}
					},
					labels: {
						format: "\"{value}",
						style: {
							color: "#191919"
						}
					},
					opposite: true
				}],

				plotOptions: {
					column: {
						grouping: false
					}
				},

				series: [
					{
						name: "Occurence",
						data: freqSeries,
						type: "spline",
						zIndex: 3,
						color: "#191919",
					},
					{
						name: "Overall",
						data: sumSeries,
						zIndex: 2
					},
					{
						name: "Positive",
						data: posSeries,
						color: "#00ce00",
					},
					{
						name: "Negative",
						data: negSeries,
						color: "#cc0000",
					},

				]
			});
		});
	}
});


Template.TimeChart.events({
	"change #word-select": function (event, template) {
		let word = $(event.currentTarget).val();
		Session.set("selectedWord", word);
	}
});
