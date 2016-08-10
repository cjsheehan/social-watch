import { chai } from "meteor/practicalmeteor:chai";
import { tweetStats, addSentiment, addFrequency, SENTIMENT, FREQUENCY, TWEET } from "./twitterStats"

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

			console.log("actual" + JSON.stringify(actual));

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
			let actual = stats["am"][FREQUENCY];
			chai.assert.equal(expected, actual);
		})

		it("aggregated sentiment score of word in (afinn+3) tweet and (afinn-2) tweet should equal 1", function () {
			let expected = 1;
			let actual = stats["am"][SENTIMENT]["score"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated positive score of (afinn+3) word in 2x +ve tweets should equal 6", function () {
			let expected = 6;
			let actual = stats["happy"][SENTIMENT]["positive"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated negative score of (afinn-2) word in 2x -ve tweets should equal 4", function () {
			let expected = 4;
			let actual = stats["sad"][SENTIMENT]["negative"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated comparative score of word in (afinn+3) tweet (3 tokens) and (afinn-2) tweet(3 tokens) should equal 0.166", function () {
			let expected = (3 - 2) / 6;
			let actual = stats["am"][SENTIMENT]["comparative"];
			chai.assert.equal(expected, actual);
		})

		it("aggregated comparative of word in 3x tweets with total afinn=+2 sentiment should equal 0", function () {
			let expected = 0;
			let actual = stats["will"][SENTIMENT]["comparative"];
			chai.assert.equal(expected, actual);
		})
	})



})

