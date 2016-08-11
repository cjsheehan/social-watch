var afinn = require("./afinn.json");

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
	let words = [];

	// Iterate over tokens
	tokens.forEach(function(token) {
		if(afinn.hasOwnProperty(token)) {

			// Lookup token in afinn, update scores as appropriate
			let valence = afinn[token];
			words.push(token);

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
	score = positive.score - negative.score;
	comparative = score / tokens.length;
	positive.comparative = positive.score / tokens.length;
	negative.comparative = negative.score / tokens.length;

	return { score, comparative, positive, negative }
}

function Valence() {
	this.score = 0;
	this.comparative = 0;
	this.words = [];
}


function clean(text) {
	return text.replace(/[^a-z ]+/ig, " ").replace("/ {2,}/", " ");
}

function tokenise(text) {
	return text.replace(/\s+/g, " ").split(" ");
}