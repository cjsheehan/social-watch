/* eslint-disable no-unused-vars*/
import { Meteor } from "meteor/meteor";
import { streamTwitter } from "./twitter/twitter";
import { formatTweet } from "./twitter/tweet.js";
import { getTestTweets, populateDb } from "./util";
import { glasgow_bbox, uk_bbox } from "./twitter/location";
/* eslint-enable no-unused-vars*/

const STREAM_ON = true;

Meteor.startup(() => {

});

if (STREAM_ON) {
	streamTwitter(glasgow_bbox);
}







