import { chai } from "meteor/practicalmeteor:chai";
import { formatTweet, centerOf, avg, getPoint, getText, getCreatedAt, getLocation, getUserName, getHashTags, getIdStr, } from "./tweet.js";

import { COORD_PRECISION } from "/lib/constants";


describe("tweet", function () {

	it("validate formatting of tweet", function () {
		let tweet = {
			"created_at": "Fri Jul 29 18:25:21 +0000 2016",
			"id": 759092464431067100,
			"id_str": "759092464431067140",
			"text": "This is a test tweet",
			"source": "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
			"truncated": false,
			"in_reply_to_status_id": 759092431983902700,
			"in_reply_to_status_id_str": "759092431983902721",
			"in_reply_to_user_id": 2442023368,
			"in_reply_to_user_id_str": "2442023368",
			"in_reply_to_screen_name": "OdinKeza",
			"user": {
				"id": 1561618855,
				"id_str": "1561618855",
				"name": "Ryan",
				"screen_name": "RyzenT7",
				"location": "Scotland",
				"url": null,
				"description": "Scottish Competitive Gamer! - AR Slayer //Nxsus//Keza//Cammy//Player for//[T7] //Nxsus - It's over//[17]//",
				"protected": false,
				"verified": false,
				"followers_count": 1160,
				"friends_count": 562,
				"listed_count": 12,
				"favourites_count": 6052,
				"statuses_count": 34803,
				"created_at": "Mon Jul 01 22:18:49 +0000 2013",
				"utc_offset": 3600,
				"time_zone": "London",
				"geo_enabled": true,
				"lang": "en",
				"contributors_enabled": false,
				"is_translator": false,
				"profile_background_color": "89C9FA",
				"profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
				"profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
				"profile_background_tile": false,
				"profile_link_color": "DD2E44",
				"profile_sidebar_border_color": "000000",
				"profile_sidebar_fill_color": "000000",
				"profile_text_color": "000000",
				"profile_use_background_image": false,
				"profile_image_url": "http://pbs.twimg.com/profile_images/758526190474891264/0IS_aszT_normal.jpg",
				"profile_image_url_https": "https://pbs.twimg.com/profile_images/758526190474891264/0IS_aszT_normal.jpg",
				"profile_banner_url": "https://pbs.twimg.com/profile_banners/1561618855/1467751634",
				"default_profile": false,
				"default_profile_image": false,
				"following": null,
				"follow_request_sent": null,
				"notifications": null
			},
			"geo": null,
			"coordinates": null,
			"place": {
				"id": "791e00bcadc4615f",
				"url": "https://api.twitter.com/1.1/geo/id/791e00bcadc4615f.json",
				"place_type": "city",
				"name": "Glasgow",
				"full_name": "Glasgow, Scotland",
				"country_code": "GB",
				"country": "United Kingdom",
				"bounding_box": {
					"type": "Polygon",
					"coordinates": [[[-4.393285,
						55.796184],
						[-4.393285,
							55.920421],
						[-4.090218,
							55.920421],
						[-4.090218,
							55.796184]]]
				},
				"attributes": {

				}
			},
			"contributors": null,
			"is_quote_status": false,
			"retweet_count": 0,
			"favorite_count": 0,
			"entities": {
				"hashtags": [
					{
						"text": "ht1",
						"indices": [
							130,
							134
						]
					},
					{
						"text": "ht2",
						"indices": [
							130,
							134
						]
					},
				],
				"urls": [],
				"user_mentions": [{
					"screen_name": "OdinKeza",
					"name": "Kez",
					"id": 2442023368,
					"id_str": "2442023368",
					"indices": [0,
						9]
				}],
				"symbols": []
			},
			"favorited": false,
			"retweeted": false,
			"filter_level": "low",
			"lang": "tl",
			"timestamp_ms": "1469816721433"
		}

		let formatted = formatTweet(tweet, "db");

		chai.assert.equal(formatted.userName, "Ryan");
		chai.assert.equal(formatted.text, "This is a test tweet");
		chai.assert.deepEqual(formatted.hashTags, ["ht1", "ht2"]);
		chai.assert.equal(formatted.createdAt, "Fri Jul 29 2016 19:25:21 GMT+0100");
		chai.assert.deepEqual(formatted.location, [-4.241751, 55.858302]);
		chai.assert.equal(formatted.idStr, "759092464431067140");

	})

	it("calculate center point of bbox", function () {
		let bboxJson = Assets.getText("bbox.json");
		let bbox = JSON.parse(bboxJson);

		let expected = [0, 0];
		let actual = centerOf(bbox["bounding_box_a"]);
		chai.assert.deepEqual(expected, actual);

		expected = [-3.5, 0.5];
		actual = centerOf(bbox["bounding_box_b"]);
		chai.assert.deepEqual(expected, actual);
	})

	it("calculate avg of 2 numbers", function () {
		let a = -7;
		let b = 4;
		let expected = -1.5;
		chai.assert.equal(avg(a, b), expected);
	})

	it("extract id string", function () {
		let expected = "759058862032826369";
		let tweet = {
			"id_str": expected
		};
		chai.assert.equal(expected, getIdStr(tweet));
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
		let expected = "Fri Jul 29 2016 19:25:21 GMT+0100";

		let tweet = {
			"created_at": "Fri Jul 29 18: 25:21 +0000 2016"
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
		let expected = ["ABC", "BCD"];

		let tweet = {
			"entities": {
				"hashtags": [
					{
						"text": expected[0],
						"indices": [
							130,
							134
						]
					},
					{
						"text": expected[1],
						"indices": [
							130,
							134
						]
					},
				]
			}
		}

		let actual = getHashTags(tweet);
		chai.assert.equal(expected.length, actual.length);
		for (var i = 0; i < expected.length; i++) {
			chai.assert.equal(expected[i], actual[i]);

		}
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
		let expected = [-3.5, 0.5];

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