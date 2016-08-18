/* eslint-disable no-unused-vars*/
import { Meteor } from "meteor/meteor";
import { streamTwitter, searchTwitter } from "./twitter/twitter";
import { formatTweet } from "./twitter/tweet.js";
import { getTestTweets, populateDb, outputTweets } from "./util";
import { glasgow_bbox, uk_bbox } from "./twitter/location";
/* eslint-enable no-unused-vars*/

const STREAM_ON = false;

Meteor.startup(() => {

});

if (STREAM_ON) {
	streamTwitter(glasgow_bbox);
}

let tweets = searchTwitter("olympics", glasgow_bbox)
// console.log("tweets ret", JSON.stringify(tweets));
 
	










