Template.Sentiment.helpers({
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