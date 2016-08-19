import { ArgumentException } from "/lib/exceptions";
import { formatTweet } from "./tweet";
import { insertTweet } from "./db";
import { Tweets, SearchResults } from "/collections/Tweets";
import { glasgow_bbox, uk_bbox } from "./location";

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

export function searchTwitter(searchQuery, until, maxId, isNewSearch) {
	console.log("searchTwitter server", searchQuery, until, isNewSearch);
	let client = new Twitter(options);
	params = {
		q: searchQuery,
		language: "en",
		locations: glasgow_bbox.toString(),
		until: until,
		max_id: maxId,
		result_type: "mixed",
		count: 100
	};

	if (isNewSearch) {
		SearchResults.remove({});
	}

	Twitter.getAsync(client, "search/tweets", params, function (error, tweets, response) {
		if (error) {
			throw error;
		}

		let formatted = tweets.statuses.map(function(tweet) {
			return formatTweet(tweet, "db");
		});

		formatted.forEach(function(tweet) {
			insertTweet(tweet, SearchResults);
		});
	});
}