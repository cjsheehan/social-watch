import { analyze } from "Sentimental";

Template.registerHelper("sentiment", function (text) {
	if(text == null) {
		throw new Error("Handlebars Helper sentiment requires 1 argument");
	}
	let sentiment = analyze(text);
	return sentiment;
});