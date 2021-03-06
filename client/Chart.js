const Highcharts = require("highcharts/highstock");

Template.Chart.helpers({
	chart: (attribute, type) => {

		let wordStats = Session.get(attribute + "Stats");
		let categories = [];
		let posSeries = [];
		let negSeries = [];
		let sumSeries = [];
		let decimalPlaces = 0;
		let visibility = true;

		let sortedBy = "words";
		if(Session.get("sortByHashtags")) {
			sortedBy = "hashtags";
		}

		if (wordStats == null) { return; }

		if (type == "comparative") {
			wordStats.forEach(function (w) {
				categories.push(w.word);
				posSeries.push(w.stats.sentiment.positive.comparative);
				negSeries.push(w.stats.sentiment.negative.comparative);
				sumSeries.push(w.stats.sentiment.comparative);
				decimalPlaces = 3;
				visibility = false;
			});
		} else {
			wordStats.forEach(function (w) {
				categories.push(w.word);
				posSeries.push(w.stats.sentiment.positive.score);
				negSeries.push(w.stats.sentiment.negative.score);
				sumSeries.push(w.stats.sentiment.score);
			});
		}
		
		Meteor.defer(function () {
			Highcharts.chart(document.getElementById(attribute + "-" + type + "-chart"), {
				chart: {
					type: "bar",
					// Edit chart spacing
					spacingBottom: 10,
					spacingTop: 10,
					spacingLeft: 10,
					spacingRight: 10,

					// Explicitly tell the width and height of a chart
					width: 400,
					height: null,
					zoomType: "xy"
				},

				title: {
					text: sortedBy + " vs " + type
				},
				subtitle: {
					text: sortedBy + " sorted by descending " + attribute
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
						text: type + "(sentiment)"
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
						return "<b>" + "\"" + this.point.category + "\" : " + "</b><br/>" + this.series.name + " Sentiment: " + Highcharts.numberFormat(this.point.y, decimalPlaces);
					},
				},
				

				series: [
					{
						name: "Overall",
						data: sumSeries,
						zIndex: 2
					},
					{
						name: "Positive",
						data: posSeries,
						color: "#00ce00",
						visible: visibility
					},
					{
						name: "Negative",
						data: negSeries,
						color: "#cc0000",
						visible: visibility
					}
				]
			});
		});
	}
});
