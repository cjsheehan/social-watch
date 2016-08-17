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
		
		let chartElement = document.getElementById(attribute + "-" + type + "-chart");
		Meteor.defer(function () {
			Highcharts.chart(chartElement, {
				chart: {
					type: "bar"
				},
				title: {
					text: "words vs " + type
				},
				subtitle: {
					text: "words sorted by descending " + attribute
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
					}
				},

				series: [
					{
						name: "Negative",
						data: negSeries,
						color: "#cc0000",
						visible: visibility
					},
					{
						name: "Positive",
						data: posSeries,
						color: "#00ce00",
						visible: visibility
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
