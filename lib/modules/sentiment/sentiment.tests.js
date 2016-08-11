import { chai } from "meteor/practicalmeteor:chai";
import { analyse, clean, tokenise } from "./sentiment"

describe("sentiment", function () {
	describe("clean", function () {
		it("should remove non-alphabetic chars from text", function () {
			let text = "	   This     Should be c!\"l£$e%^&a*()n text  	";
			let expected = "this should be clean text";
			let actual = clean(text);
			chai.assert.equal(expected, actual);
		});
	});

	describe("tokenise", function () {
		it("should return valid array of tokens from string", function () {
			let text = "This text should be tokenised";
			let expected = ["This", "text", "should", "be", "tokenised"];
			let actual = tokenise(text);
			chai.assert.deepEqual(expected, actual);
		});
	});

	describe("analyse", function () {

		describe("positive", function () {
			describe("comparative", function () {
				it("should return score / number of words", function () {
					let text = "This is a fun test";
					chai.assert.equal(0.80, analyse(text).positive.comparative);
				});
			});

			describe("score", function () {
				it("should return correct positive score when text contains positive and negative words", function () {
					let text = "This is a fun torture test";
					chai.assert.equal(0.667, analyse(text).positive.comparative);
				});
			});
		});

		describe("negative", function () {
			describe("comparative", function () {
				it("should return score / number of words", function () {
					let text = "This is a torture test";
					chai.assert.equal(-0.80, analyse(text).negative.comparative);
				});
			});

			describe("score", function () {
				it("should return correct negative score when text contains negative and positive words", function () {
					let text = "This is a fun torture test";
					chai.assert.equal(-0.667, analyse(text).negative.comparative);
				});
			});
		});

		describe("overall sentiment", function () {
			describe("score", function () {

				it("should return score of 15 for text with exclusive +ve(5 + 4 + 3 + 2 + 1) words", function () {
					let text = "breathtaking brilliant captivated calming certain";
					chai.assert.equal(15, analyse(text).score);
				});

				it("should return score of -15 for text with exclusive -ve(-5 + -4 + -3 + -2 + -1) words", function () {
					let text = "prick catastrophic catastrophe careless cancel";
					chai.assert.equal(-15, analyse(text).score);
				});

				it("should return score of 0 for text balanced positive and negative words", function () {
					let text = "breathtaking brilliant captivated calming certain prick catastrophic catastrophe careless cancel";
					chai.assert.equal(0, analyse(text).score);
				});

				it("should score words with punctuation", function () {
					chai.assert.equal(4, analyse("the fun!!").score);
					chai.assert.equal(-4, analyse("the torture!!").score);
				});
			});

			describe("comparative", function () {
				it("should return score / number of words for mixed positive negative text", function () {
					let text = "This is a toothless fun test";
					chai.assert.equal(0.333, analyse(text).comparative);
				});
			});
		});
	});
});

