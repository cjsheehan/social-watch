import { chai } from "meteor/practicalmeteor:chai";
import { getWords, clean, removeStop, wordFrequency } from "/lib/modules/wordStats";

describe("wordStats", function () {
	it("get individual word units from string", function () {
		let text = "cat dog frog hamster";
		let expected = ["cat", "dog", "frog", "hamster"];
		actual = getWords(text);
		chai.assert.deepEqual(expected, actual);
	})

	it("clean punctuation from string", function () {
		let text = "start[{}.,\/!$%\^&\*;:=\-_`~()] middle/[{}.,\/!$%\^&\*;:=\-_`~()] end";
		let expected = "start middle end";
		actual = clean(text);
		chai.assert.equal(expected, actual);
	})

	it("ensure hashtags remain after clean", function () {
		let text = "start [{}.,\/!$%\^&\*;:=\-_`~()] #middle/[{}.,\/ #!$%\^&\*;:=\-_`~()] end";
		let expected = "start #middle # end";
		actual = clean(text);
		chai.assert.equal(expected, actual);
	})

	it("remove stop words from text", function () {
		let text = "Hamster whomever you cat yours dog";
		let expected = ["Hamster", "cat", "dog"];
		actual = removeStop(text);
		chai.assert.deepEqual(expected, actual);
	})

	it("word frequency analysis of text", function () {
		let text = "Hamster whomever you cat yours dog yourselves frog hamster goat cat dog frog hamster hamster CAT";

		let expected = [
			["hamster", 4],
			["cat", 3],
			["dog", 2],
			["frog", 2],
			["goat", 1]
		]
		actual = wordFrequency(text);
		chai.assert.deepEqual(expected, actual);
	})
});