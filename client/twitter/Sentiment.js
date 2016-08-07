import { analyze } from "Sentimental";

Template.Sentiment.helpers({
	sentiment: (text) => {
		console.log("text:" + text);
		
		let sentiment = analyze(text);
		console.log(JSON.stringify(sentiment));
		return sentiment;
	},

	evalScore: (score, isNegative) => {
		if (score > 0) {
			if(isNegative) {
				return "neg-sentiment";
			} else {
				return "pos-sentiment";
			}
		} else if(score < 0) {
			return "neg-sentiment";
		} else {
			return "neutral-sentiment";
		}
	}
});