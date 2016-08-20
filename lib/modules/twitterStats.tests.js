import { chai } from "meteor/practicalmeteor:chai";
import { tweetStats, addSentiment, tokenise, timeBins, timeStats } from "./twitterStats"
import { CAT_FORMAT } from "/lib/constants";
const moment = require("moment");

describe("twitterStats", function () {

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
				"numTokens": 0,
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
				"comparative": 0.75,
				"numTokens": 4,
				"positive": {
					"score": 6,
					"comparative": 1.5,
				},
				"negative": {
					"score": -3,
					"comparative": -0.75,
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
				text: "I ama happy", // +3 afinn
			},
			{
				text: "I ama sad", // -2 afinn
			},
			{
				text: "toast makes me happy", // +3 afinn
			},
			{
				text: "toast makes me sad", // -2 afinn
			},
			{
				text: "I willa go out smiling", // +2 afinn
			},
			{
				text: "I willa go out again", // 0 afinn
			},
			{
				text: "I willa go out again", // 0 afinn
			}
		];
		let stats = tweetStats(tweets, false);

		it("aggregated frequency of 2x occurring word should equal 2", function () {
			let expected = 2;
			let actual = stats.words["ama"].frequency;
			chai.assert.equal(expected, actual);
		})

		it("aggregated sentiment score of word in (afinn+3) tweet and (afinn-2) tweet should equal 1", function () {
			let expected = 1;
			let actual = stats.words["ama"].sentiment.score;
			chai.assert.equal(expected, actual);
		})

		it("aggregated positive score of (afinn+3) word in 2x +ve tweets should equal 6", function () {
			let expected = 6;
			let actual = stats.words["happy"].sentiment.positive.score;
			chai.assert.equal(expected, actual);
		})

		it("aggregated negative score of (afinn-2) word in 2x -ve tweets should equal -4", function () {
			let expected = -4;
			let actual = stats.words["sad"].sentiment.negative.score;
			chai.assert.equal(expected, actual);
		})

		it("aggregated comparative score of word in (afinn+3) tweet (3 tokens) and (afinn-2) tweet(3 tokens) should equal 0.166", function () {
			let expected = 1 / 6;
			let actual = stats.words["ama"].sentiment.comparative;
			chai.assert.equal(expected, actual);
		})

		it("aggregated comparative of word in 3x tweets (15 tokens total) with total afinn=+2 should equal 0.133", function () {
			let expected = 2 / 15;
			let actual = stats.words["willa"].sentiment.comparative;
			chai.assert.equal(expected, actual);
		})
	})

	describe("hashtag extraction", function () {
		let tweets = [
			{
				text: "I ama #happytoday",
			},
			{
				text: "I ama #happytoday #happytoday",
			},
			{
				text: "I ama #happytoday #sadtoday ",
			},
			{
				text: "notahashtag# ",
			},
		];

		let stats = tweetStats(tweets, true);

		it("hashtags aggregated and sorted descending by frequency", function () {
			let actual = stats.frequency;
			let expected = [["#happytoday", 4], ["#sadtoday", 1]];
			chai.assert.deepEqual(expected, actual);
		});

	})


	describe("timebins", function () {
		let tweets = [
			{
				text: "I ama happy", // +3 afinn
				createdAt: "Fri Jul 29 18:23:18 +0000 2016",
			},
			{
				text: "I ama sad", // -2 afinn
				createdAt: "Fri Jul 29 18:27:18 +0000 2016",
			},
			{
				text: "toast makes me happy", // +3 afinn
				createdAt: "Fri Jul 29 18:22:18 +0000 2016",
			},
			{
				text: "toast makes me sad", // -2 afinn
				createdAt: "Fri Jul 29 17:24:18 +0000 2016",
			}
		];

		it("time bins chronological", function () {
			let actual = timeBins(tweets);
			console.log("actual", JSON.stringify(actual));

			chai.assert.equal(actual[0].end.toString(), "Fri Jul 29 2016 19:27:18 GMT+0100 (GMT Daylight Time)");
			chai.assert.equal(actual[0].start.toString(), "Fri Jul 29 2016 19:17:18 GMT+0100 (GMT Daylight Time)");

			chai.assert.equal(actual[1].end.toString(), "Fri Jul 29 2016 19:17:18 GMT+0100 (GMT Daylight Time)");
			chai.assert.equal(actual[1].start.toString(), "Fri Jul 29 2016 19:07:18 GMT+0100 (GMT Daylight Time)");
		});


		it("tweets put in correct times bins", function () {
			let tweets = [
				{
					text: "I ama happy", // +3 afinn
					createdAt: "Fri Jul 29 18:23:18 +0000 2016",
				},
				{
					text: "I ama sad", // -2 afinn
					createdAt: "Fri Jul 29 18:27:18 +0000 2016",
				},
				{
					text: "toast makes me happy", // +3 afinn
					createdAt: "Fri Jul 29 18:22:18 +0000 2016",
				},
				{
					text: "toast makes me sad", // -2 afinn
					createdAt: "Fri Jul 29 17:24:18 +0000 2016",
				},
				{
					text: "thanks great great great great great",
					createdAt: "Fri Jul 29 18:03:18 +0000 2016",
				}
			];
			let actual = timeStats(tweets, false);
			console.log("actual[0]", JSON.stringify(actual[0]));

			// note: reverse chronological is expected
			chai.assert.deepEqual(actual[0].tweets[0], tweets[0]);
			chai.assert.deepEqual(actual[0].tweets[1], tweets[1]);
			chai.assert.deepEqual(actual[0].tweets[2], tweets[2]);
			chai.assert.deepEqual(actual[1].tweets[0], tweets[3]);
		});

	})

	describe("sorting by supplied parameter", function () {
		let tweets = [
			{
				text: "Today Today Today great sunshine #happytoday",
			},
			{
				text: "Saturday rain rain unhappy #sadsaturday",
			}
		];

		describe("sort by words", function () {
			let actual = tweetStats(tweets, false);

			// expected
			let frequency = [["today", 3], ["great", 3], ["sunshine", 2], ["rain", 4], ["unhappy",], ["#happytoday", 2], ["#sadsaturday", 2]];

			let score = [["#sadsaturday", 2]];
			let comparative = [["#happytoday", 2]];



		});

		// describe("sort by hashtags", function () {
		// 	let actual = tweetStats(tweets, "hashtags");

		// 	// expected
		// 	let frequency = [["#happytoday", 2], ["#sadsaturday", 2], ["#sadtoday", 1], ["#sadsaturday", 1]];
		// 	let score = [[]];
		// 	let comparative = [[]];
		// });


	});

	describe("validate tokenise", function () {
		it("tokenised string with 8 tokens should have length 8", function () {
			let text = "I  ama    a test string with 8 tokens";
			let expected = 8;
			let actual = tokenise(text);
			chai.assert.equal(expected, actual.length);
		})
	})
})

