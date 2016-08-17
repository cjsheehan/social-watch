import { ArgumentException } from "/lib/exceptions";
import { formatTweet } from "./tweet";
import { insertTweet } from "./db";
import { Tweets } from "/collections/Tweets";

const options = {
	consumer_key: Meteor.settings.private.twitter.consumer_key,
	consumer_secret: Meteor.settings.private.twitter.consumer_secret,
	access_token_key: Meteor.settings.private.twitter.access_token,
	access_token_secret: Meteor.settings.private.twitter.access_secret
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
						console.log("formatted", JSON.stringify(formatted));
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