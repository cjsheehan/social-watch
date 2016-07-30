import { chai } from "meteor/practicalmeteor:chai";
import { centerOf } from "./tweet.js";
import { avg } from "./tweet.js";
import { getPoint } from  "./tweet.js";
import { getText } from  "./tweet.js";
import { getCreatedAt } from  "./tweet.js";
import { getLocation } from  "./tweet.js";
import { getUserName } from  "./tweet.js";
import { getHashTags } from  "./tweet.js";

import "./tweet.js";


describe("tweet", function () {
	it("calculate center point of bbox", function () {
		let bboxJson = Assets.getText("bbox.json");
		let bbox = JSON.parse(bboxJson);

		let expected = [(0).toFixed(6), (0).toFixed(6)];
		let actual = centerOf(bbox["bounding_box_a"]);
		chai.assert.deepEqual(expected, actual);

		expected = [(-3.5).toFixed(6), (0.5).toFixed(6)];
		actual = centerOf(bbox["bounding_box_b"]);
		chai.assert.deepEqual(expected, actual);
	})

	it("calculate avg of 2 numbers", function () {
		let a = -7;
		let b = 4;
		let expected = -1.5;
		chai.assert.equal(avg(a, b), expected);
	})

	it("extract point data", function () {
		let long = -12.34567890;
		let lat = -22.34567890;
		let expected = [long, lat];

		let tweet = {
			"coordinates": {
				"coordinates": [
					long,
					lat
				],
				"type": "Point"
			}
		};

		let actual = getPoint(tweet);
		chai.assert.deepEqual(actual, expected);
	})

	it("extract text data", function () {
		let expected = "test text";

		let tweet = {
			"text": expected
		};

		chai.assert.equal(expected, getText(tweet));
	})

	it("extract created_at data", function () {
		let expected = "Mon Jul 25 16:52:01 +0000 2016";

		let tweet = {
			"created_at": expected
		};

		chai.assert.equal(expected, getCreatedAt(tweet));
	})

	it("extract userName data", function () {
		let expected = "Chris Sheehan";

		let tweet = {
			"user": {
				name: expected
			}
		};

		chai.assert.equal(expected, getUserName(tweet));
	})

	it("extract hashtag data", function () {
		let expectedA = "ABC";
		let expectedB = "DEF";

		let tweet = {
			"entities": {
				"hashtags": [
					{
						"text": expectedA,
						"indices": [
							130,
							134
						]
					},
					{
						"text": expectedB,
						"indices": [
							130,
							134
						]
					},
				]
			}
		}

		let actual = getHashTags(tweet);
		console.log(actual);
		chai.assert.equal(expectedA, actual[0]["text"]);
		chai.assert.equal(expectedB, actual[1]["text"]);
	})


	it("extract location, pt should take precedence", function () {
		let sw = [-77.119759, 38.791645];
		let se = [-76.909393, 38.791645];
		let ne = [-76.909393, 38.995548];
		let nw = [-77.119759, 38.995548];
		let expected = sw;

		let tweet = {
			"place": {
				"attributes": {},
				"bounding_box": {
					"coordinates": [[sw, se, ne, nw]],
					"type": "Polygon"
				}
			},
			"coordinates": {
				"coordinates": sw,
				"type": "Point"
			},
		};

		let actual = getLocation(tweet);
		chai.assert.equal(expected, actual);
	})

	it("extract location, pt from bbox", function () {
		let sw = [-10, -3];
		let se = [-10, 4];
		let ne = [3, 4];
		let nw = [3, -3];
		let expected = [(-3.5).toFixed(6), (0.5).toFixed(6)];

		let tweet = {
			"place": {
				"attributes": {},
				"bounding_box": {
					"coordinates": [[sw, se, ne, nw]],
					"type": "Polygon"
				}
			}
		};

		let actual = getLocation(tweet);
		chai.assert.deepEqual(expected, actual);
	})
})