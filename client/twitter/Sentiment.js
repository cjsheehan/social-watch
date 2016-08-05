import { analyze } from "Sentimental";

Template.Sentiment.helpers({
	sentiment: (text) => {
		let sentiment = analyze(text);
		// console.log(text);
		// console.log(sentiment.score);
		console.log(sentiment);
		return sentiment;
	}
});