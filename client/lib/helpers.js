import { analyse } from "/lib/modules/sentiment";

Template.registerHelper("sentiment", function (text) {
	if (text == null) {
		throw new Error("Handlebars Helper sentiment requires 1 argument");
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