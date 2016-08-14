import { analyse } from "/lib/modules/sentiment";

Template.registerHelper("sentiment", function (text) {
	if (text == null) {
		text = "";
	}
	let sentiment = analyse(text);
	return sentiment;
});

Template.registerHelper("sentimentAttr", function (score) {
	if (score > 0) {
		return "pos-sentiment";
	} else if (score < 0) {
		return "neg-sentiment";
	} else {
		return "neutral-sentiment";
	}
});

Template.registerHelper("formatDecimal", function (num, places) {
	return num.toFixed(places);
});