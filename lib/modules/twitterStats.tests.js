import { chai } from "meteor/practicalmeteor:chai";
import { tweetStats, addSentiment, tokenise } from "./twitterStats"

describe("tweetStats", function () {

	describe("validate addSentiment() functionality", function () {
		describe("aggregate of 2 empty sentiments should equal an empty sentiment", function () {
			let sentiment = {
				"score": 0,
				"comparative": 0,
				"positive": {
					"score": 0,
					"comparative": 0,
					"words": []
				},
				"negative": {
					"score": 0,
					"comparative": 0,
					"words": []
				}
			}
			let expected = sentiment;
			let actual = addSentiment(sentiment, sentiment);

			it("aggregate 2x 0 scores should equal 0", function () {
				chai.assert.equal(expected.score, actual.score);
			})

			it("aggregate 2x 0 comparatives should equal 0", function () {
				chai.assert.equal(expected.comparative, actual.comparative);
			})

			it("aggregate 2x 0 +ve scores should equal 0", function () {
				chai.assert.equal(expected.positive.score, actual.positive.score);
			})

			it("aggregate 2x 0 +ve comparatives should equal 0", function () {
				chai.assert.equal(expected.positive.comparative, actual.positive.comparative);
			})

			it("aggregate 2x 0 -ve scores should equal 0", function () {
				chai.assert.equal(expected.negative.score, actual.negative.score);
			})

			it("aggregate 2x 0 -ve comparatives should equal 0", function () {
				chai.assert.equal(expected.negative.comparative, actual.negative.comparative);
			})
		})

		describe("aggregate of a & b sentiments", function () {
			let a = {
				"score": 0,
				"comparative": 0,
				"positive": {
					"score": 0,
					"comparative": 0,
				},
				"negative": {
					"score": 0,
					"comparative": 0,
				}
			}

			let b = {
				"score": 3,
				"comparative": 1.5,
				"positive": {
					"score": 6,
					"comparative": 1.5,
				},
				"negative": {
					"score": 3,
					"comparative": 1.5,
				}
			}


			let actual = addSentiment(a, b);

			it("aggregate score (0,3) should equal 3", function () {

				chai.assert.equal(b.score, actual.score);
			})

			it("aggregate comparatives(0, 1.5) should equal 1.5", function () {
				chai.assert.equal(b.comparative, actual.comparative);
			})

			it("aggregate positive.scores (0, 6) should equal 6", function () {
				chai.assert.equal(b.positive.score, actual.positive.score);
			})

			it("aggregate positive.comparatives (0, 1.5) should equal 1.5", function () {
				chai.assert.equal(b.positive.comparative, actual.positive.comparative);
			})

			it("aggregate negative.scores (0, 3) should equal 3", function () {
				chai.assert.equal(b.negative.score, actual.negative.score);
			})

			it("aggregate negative.comparatives (0, 3) should equal 3", function () {
				chai.assert.equal(b.negative.comparative, actual.negative.comparative);
			})
		})
	})

	describe("validate aggregated tweet stats", function () {
		let tweets = [
			{
				text: "I am happy", // +3 afinn
			},
			{
				text: "I am sad", // -2 afinn
			},
			{
				text: "toast makes me happy", // +3 afinn
			},
			{
				text: "toast makes me sad", // -2 afinn
			},
			{
				text: "I will go out smiling", // +2 afinn
			},
			{
				text: "I will go out again", // 0 afinn
			},
			{
				text: "I will go out again", // 0 afinn
			}
		];
		let stats = tweetStats(tweets);

		it("aggregated frequency of 2x occurring word should equal 2", function () {
			let expected = 2;
			let actual = stats["am"]["frequency"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated sentiment score of word in (afinn+3) tweet and (afinn-2) tweet should equal 1", function () {
			let expected = 1;
			let actual = stats["am"]["sentiment"]["score"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated positive score of (afinn+3) word in 2x +ve tweets should equal 6", function () {
			let expected = 6;
			let actual = stats["happy"]["sentiment"]["positive"]["score"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated negative score of (afinn-2) word in 2x -ve tweets should equal 4", function () {
			let expected = 4;
			let actual = stats["sad"]["sentiment"]["negative"]["score"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated comparative score of word in (afinn+3) tweet (3 tokens) and (afinn-2) tweet(3 tokens) should equal 0.166", function () {
			let expected = (3 - 2) / 6;
			let actual = stats["am"]["sentiment"]["comparative"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated comparative of word in 3x tweets with total afinn=+2 and valid tokens (6) should equal 0.4", function () {
			let expected = 0.4;
			let actual = stats["will"]["sentiment"]["comparative"];
			chai.assert.equal(expected, actual);
		})
	})

	describe("validate tokenise", function () {
		it("tokenised string with 8 tokens should have length 8", function () {
			let text = "I  am    a test string with 8 tokens";
			let expected = 8;
			let actual = tokenise(text);
			console.log("actual", actual);
			chai.assert.equal(expected, actual.length);
		})
	})
})

