import { Tweets } from "/collections/Tweets";
import { formatTweet } from "./twitter/tweet";
import { insertTweet } from "./twitter/db";
import { ArgumentException, DuplicateDocException } from "/lib/exceptions";

const moment = require("moment");

export function getTestTweets() {
    let jsonTweet = Assets.getText("tweet_stream.json");
    let tweets = JSON.parse(jsonTweet);
    return tweets;
}

export function populateDb(tweets) {
    if (tweets == null) {
        throw new ArgumentException("populateDb(tweets) valid tweets argument required");
    }

    for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        let formatted = formatTweet(tweet, "object");
        console.log(formatted);
        try {
            insertTweet(formatted, Tweets);
        } catch (error) {
            if (error instanceof DuplicateDocException) {
                console.log("populateDb error: " + error.message);
            }
        }
    }
}

export function sortByDate(tweets) {
    return tweets.sort(function (a, b) {
        let aDate = moment(a.createdAt, "dd MMM DD HH:mm:ss ZZ YYYY", "en").format("MMM DD, HH:mm");
        let bDate = moment(b.createdAt, "dd MMM DD HH:mm:ss ZZ YYYY", "en").format("MMM DD, HH:mm");
        return new Date(bDate) - new Date(aDate);
    });
}


export function outputTweets(tweets, formatAs) {
    if (tweets == null) {
        throw new ArgumentException("valid tweets argument required");
    }

    for (let i = 0; i < tweets.length; i++) {
        let formatted = formatTweet(tweets[i], formatAs);
        if (formatAs == "json") {
            try {
                let fs = Npm.require("fs");
                fs.appendFile("../../../../../../../tweet_search_formatted.json", JSON.stringify(formatted), function (err) {
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

