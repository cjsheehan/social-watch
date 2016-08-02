import { ArgumentException } from "/lib/exceptions";

const LOCATIONS_KEY = "locations";
const options = {
	consumer_key: Meteor.settings.private.twitter.consumer_key,
	consumer_secret: Meteor.settings.private.twitter.consumer_secret,
	access_token_key: Meteor.settings.private.twitter.access_token,
	access_token_secret: Meteor.settings.private.twitter.access_secret
}

let fs = Npm.require("fs");

export function streamTwitter(locations) {

	if (locations == null) {
		throw new ArgumentException("locations argument must be provided");
	} else if (locations.constructor !== Array) {
		throw new ArgumentException("locations argument must be an array of numbers");
	} 

	try {
		let client = new Twitter(options);
		Twitter.streamAsync(client, "statuses/filter", { LOCATIONS_KEY: locations.toString() },
			function (stream) {

				stream.on("data", function (tweet) {
					console.log(tweet.text);
					try {
						fs.appendFile("../../../../../../../tweets.txt", JSON.stringify(tweet), function (err) {
							if (err) {
								return console.log(err);
							}
						});
					} catch (error) {
						return console.log(error);
					}
				});

				stream.on("error", function (error) {
					throw error;
				});

			});

	} catch (error) {
		console.log(error);
	}
}