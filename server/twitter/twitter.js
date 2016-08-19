import { ArgumentException } from "/lib/exceptions";
import { formatTweet } from "./tweet";
import { insertTweet } from "./db";
import { Tweets, SearchResults } from "/collections/Tweets";
import { glasgow_bbox, uk_bbox } from "./location";
import { sortByDate } from "/lib/util";

const options = {
	consumer_key: Meteor.settings.private.twitter.consumer_key,
	consumer_secret: Meteor.settings.private.twitter.consumer_secret,
	access_token_key: Meteor.settings.private.twitter.access_token,
	access_token_secret: Meteor.settings.private.twitter.access_secret
}

export function clearSearch() {
	console.log("clear called");
	SearchResults.remove({});
}

export function streamTwitter(loc) {

	if (loc == null) {
		throw new ArgumentException("locations argument must be provided");
	} else if (loc.constructor !== Array) {
		throw new ArgumentException("locations argument must be an array of numbers");
	} 

	try {
		let client = new Twitter(options);
		Twitter.streamAsync(client, "statuses/filter", { locations: loc.toString(), language: "en" },
			function (stream) {
				stream.on("data", Meteor.bindEnvironment(function (tweet) {
					try {
						let formatted = formatTweet(tweet, "db");
						insertTweet(formatted, Tweets);
					} catch (error) {
						console.log(error);
					}
				}));

				stream.on("error", function (error) {
					throw error;
				});

			});

	} catch (error) {
		console.log("Twitter.streamAsync error: ", error);
	}
}

export function searchTwitter(searchQuery) {
	console.log("searchTwitter server", searchQuery);
	clearSearch();
	let client = new Twitter(options);
	let params = {
		q: searchQuery,
		language: "en",
		locations: glasgow_bbox.toString(),
		max_id: "",
		result_type: "popular",
		count: 15
	};


	// for (var i = 0; i < 5; i++) {
	// 	Twitter.getAsync(client, "search/tweets", params, function (error, tweets, response) {
	// 		if (error) {
	// 			throw error;
	// 		}

	// 		let formatted = tweets.statuses.map(function (tweet) {
	// 			return formatTweet(tweet, "db");
	// 		});

	// 		formatted.forEach(function (tweet) {
	// 			insertTweet(tweet, SearchResults);
	// 		});

	// 		let sorted = sortByDate(formatted);
	// 		sorted.map(function(tweet) {
	// 			console.log("tweet date", tweet.createdAt);
				
	// 		})
	// 		// params.maxId = sorted[sorted.length - 1];
	// 		params.maxId = sorted[Math.floor((sorted.length - 1) / 2)].idStr;
	// 		console.log("maxId", params.maxId, i);
	// 	});
		
	// }

}