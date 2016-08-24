import { TOP_FREQ_WORDS, TOP_SCORE_WORDS, TOP_COMP_WORDS } from "./lib/constants";

const Highcharts = require("highcharts/highstock");

const moment = require("moment");

Template.TimeChart.helpers({

	topWords: () => {
		let type = Session.get("selectedStatType");
		let topWords = [];
		if (type == "score") {
			topWords = Session.get([TOP_SCORE_WORDS]);
		} else if (type == "comparative") {
			topWords = Session.get([TOP_COMP_WORDS]);
		} else {
			topWords = Session.get([TOP_FREQ_WORDS]);
		}
		return topWords;
	},

	chart: () => {
		let sortedBy = "words";
		if (Session.get("sortByHashtags")) {
			sortedBy = "hashtags";
		}
		let timeBins = Session.get("activeTimeStats");
		let categories = [];
		let posSeries = [];
		let negSeries = [];
		let sumSeries = [];
		let freqSeries = [];
		let numTweetsSeries = [];

		if (timeBins == null) { return; }

		let word = Session.get("selectedWord");
		let type = Session.get("selectedStatType");

		for (var i = 0; i < timeBins.length; i++) {
			var bin = timeBins[i];
			let time = moment(bin.end).format("HH:mm").toString();
			categories.push(time);

			// init series with correct data wrt to selectedStatType
			numTweetsSeries.push(bin.stats.numTweets);
			if (!bin.stats.words[word]) {
				posSeries.push(0);
				negSeries.push(0);
				sumSeries.push(0);
				freqSeries.push(0);
			} else {
				if (type == "comparative") {
					posSeries.push(bin.stats.words[word].sentiment.positive.comparative);
					negSeries.push(bin.stats.words[word].sentiment.negative.comparative)
					sumSeries.push(bin.stats.words[word].sentiment.comparative);
					freqSeries.push(bin.stats.words[word].numTweets);
				} else {
					posSeries.push(bin.stats.words[word].sentiment.positive.score);
					negSeries.push(bin.stats.words[word].sentiment.negative.score)
					sumSeries.push(bin.stats.words[word].sentiment.score);
					freqSeries.push(bin.stats.words[word].numTweets);
				}
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
				subtitle: {
					text: sortedBy + " selected from top " + type + " list"
				},

				xAxis: {
					type: "datetime",
					categories: categories,
					reversed: true,
					labels: {
						step: 1,
						rotation: -45,
					}
				},

				// tooltip: {
				// 	shared: true
				// },

				yAxis: [
					{ // Primary yAxis
						title: {
							text: "score (sentiment)"
						},
						labels: {
							formatter: function () {
								return this.value;
							}
						}
					},
					{
						title: {
							text: "\"" + word + "\"" + " (x occured)",
							style: {
								color: "#191919"
							}
						},
						labels: {
							formatter: function () {
								return this.value;
							},
							step: 1
						},
						opposite: true
					}, {
						title: {
							text: "Total tweets",
							style: {
								color: "#aa8cc5"
							}
						},
						labels: {
							formatter: function () {
								return this.value;
							},
							step: 1,
							style: {
								color: "#aa8cc5"
							}
						},
						opposite: true
					}
				],

				tooltip: {
					shared: true
				},

				plotOptions: {
					column: {
						grouping: false
					}
				},

				series: [
					{
						name: "total tweets",
						data: numTweetsSeries,
						type: "spline",
						zIndex: 3,
						yAxis: 2,
						color: "#aa8cc5"
					},
					{
						name: "x Occured",
						data: freqSeries,
						type: "spline",
						zIndex: 3,
						color: "#191919",
						yAxis: 1,
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
	},
	"change #stat-type-select": function (event, template) {
		let type = $(event.currentTarget).val();
		Session.set("selectedStatType", type);
		$("#word-select")[0].selectedIndex = 0;
	}
});
