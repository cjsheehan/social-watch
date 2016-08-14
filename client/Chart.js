const d3 = require("d3");

Template.Chart.onRendered(function () {

	let data = [
		{ name: "Locke", value: 4 },
		{ name: "Reyes", value: 8 },
		{ name: "Ford", value: 15 },
		{ name: "Jarrah", value: 16 },
		{ name: "Shephard", value: 23 },
		{ name: "Kwon", value: 18 }
	];

	var width = 200,
		barHeight = 20;


	var x = d3.scaleLinear()
		.domain([0, d3.max(data.map(function(d){ return d.value;} ))])
		.range([0, width]);

	var chart = d3.select(".chart")
		.attr("width", width);

		chart.attr("height", barHeight * data.length);

		var bar = chart.selectAll("g")
			.data(data)
			.enter().append("g")
			.attr("transform", function (d, i) { return "translate(0," + i * barHeight + ")"; });

		bar.append("rect")
			.attr("width", function (d) { return x(d.value); })
			.attr("height", barHeight - 1);

		bar.append("text")
			.attr("x", function (d) { return x(d.value) - 3; })
			.attr("y", barHeight / 2)
			.attr("dy", ".35em")
			.text(function (d) { return d.value; });
});
