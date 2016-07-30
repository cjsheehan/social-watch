/* eslint-disable no-unused-vars*/
import { Meteor } from "meteor/meteor";
/* eslint-enable no-unused-vars*/

import { formatTweet } from "./twitter/tweet.js";

Meteor.startup(() => {
	// code to run on server at startup
});

// streamTwitter(glasgow_bbox);


outputStream();

function outputStream() {
	let jsonTweet = Assets.getText("tweet_stream.json");
	let tweets = JSON.parse(jsonTweet);
	let formatAs = "json";


	for (let i = 0; i < tweets.length; i++) {
		let formatted = formatTweet(tweets[i], formatAs);
		if(formatAs === "json") {
			try {
				let fs = Npm.require("fs");
				console.log("cwd:" + process.cwd());
				fs.appendFile("../../../../../../../tweet_stream_formatted.json", JSON.stringify(formatted), function (err) {
					if (err) {
						return console.log(err);
					}
				});
			} catch (error) {
				return console.log(error);
			}
		} else {
			console.log("tweet: " + i);
			console.log(formatted);
		}
	}
}






