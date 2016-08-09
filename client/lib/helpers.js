import { analyze } from "Sentimental";

Template.registerHelper("sentiment", function (text) {
	if(text == null) {
		throw new Error("Handlebars Helper sentiment requires 1 argument");
	}
	let sentiment = analyze(text);
	return sentiment;
});

Template.registerHelper("sentimentAttr", function (score, isNegative = true) {
	console.log(isNegative);
	if (score > 0) {
		if (isNegative) {
			return "neg-sentiment";
		} else {
			return "pos-sentiment";
		}
	} else if (score < 0) {
		return "neg-sentiment";
	} else {
		return "neutral-sentiment";
	}
});