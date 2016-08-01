/* eslint-disable no-unused-vars*/
import { Meteor } from "meteor/meteor";
import { formatTweet } from "./twitter/tweet.js";
import { getTestTweets, populateDb } from "./util";
/* eslint-enable no-unused-vars*/

import "/collections/Tweets.js";

Meteor.startup(() => {
	// code to run on server at startup
});

// streamTwitter(glasgow_bbox);


// outputStream();
let tweets = getTestTweets();
// console.log(tweets);
populateDb(tweets);

// outputStream(tweets, "string");






