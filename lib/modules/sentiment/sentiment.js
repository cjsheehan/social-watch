const afinn = require("./AFINN-111.json");
const MAX_PLACES = 3;

export function analyse(text) {
	if(text == null) {
		throw new Error("analyse requires valid text arg");
	}

	let cleanedText = clean(text);
	let tokens = tokenise(cleanedText);
	let score = 0;
	let comparative = 0;
	let positive = new Valence();
	let negative = new Valence();


	// Iterate over tokens
	tokens.forEach(function(token) {
		if(afinn.hasOwnProperty(token)) {

			// Lookup token in afinn
			let valence = afinn[token];

			// Update scores as appropriate
			if(valence > 0) {
				positive.score += afinn[token];
				positive.words.push(token);
			} else if (valence < 0) {
				negative.score += afinn[token];
				negative.words.push(token);
			}
		}
	});

	// Final Sentiment
	score = positive.score + negative.score;
	comparative = (score / tokens.length).toFixed(MAX_PLACES);

	// Fix the valence comparative decimals
	positive.comparative = (positive.score / tokens.length).toFixed(MAX_PLACES);
	negative.comparative = (negative.score / tokens.length).toFixed(MAX_PLACES);

	return { score, comparative, positive, negative }
}

function Valence() {
	this.score = 0;
	this.comparative = 0;
	this.words = [];
}


export function clean(text) {
	return text
		.replace(/[^a-z ]+/ig, "")  // non-alphabet
		.replace(/\s+/g, " ") // multi-whitespace
		.toLowerCase()
		.trim();
}

export function tokenise(text) {
	return text.split(" ");
}