const Highcharts = require("highcharts/highstock");

Template.Chart.helpers({
	chart: (attribute) => {

		let wordStats = Session.get(attribute + "Stats");
		let categories = [];
		let posSeries = [];
		let negSeries = [];
		let scoreSeries = [];

		if (wordStats == null) { return; }

		// if(attribute == "comparative") {
		// 	console.log("comparative chart", JSON.stringify(wordStats));
			
		// 	wordStats.forEach(function (w) {
		// 		categories.push(w.word);
		// 		posSeries.push(w.stats.sentiment.positive.comparative);
		// 		negSeries.push(w.stats.sentiment.negative.comparative);
		// 		scoreSeries.push(w.stats.sentiment.comparative);
		// 	});
		// } else {
		// 	wordStats.forEach(function (w) {
		// 		categories.push(w.word);
		// 		posSeries.push(w.stats.sentiment.positive.score);
		// 		negSeries.push(w.stats.sentiment.negative.score);
		// 		scoreSeries.push(w.stats.sentiment.score);
		// 	});
		// }

		wordStats.forEach(function (w) {
			categories.push(w.word);
			posSeries.push(w.stats.sentiment.positive.score);
			negSeries.push(w.stats.sentiment.negative.score);
			scoreSeries.push(w.stats.sentiment.score);
		});

		Meteor.defer(function () {
			Highcharts.chart(document.getElementById(attribute +"-chart"), {
				chart: {
					type: "bar"
				},
				title: {
					text: "Aggregated sentiment for words on twitter stream"
				},
				subtitle: {
					text: "sorted by " + attribute
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
	}
});
