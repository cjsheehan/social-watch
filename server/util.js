import { Tweets } from "/collections/Tweets";
import { formatTweet } from "./twitter/tweet";

/* eslint-disable no-unused-vars*/
export function ArgumentNullException(message) {
    this.message = message;
    this.name = "ArgumentNullException";
}

export function ArgumentException(message) {
    this.message = message;
    this.name = "ArgumentException";
}
/* eslint-enable no-unused-vars*/


export function getTestTweets() {
    let jsonTweet = Assets.getText("tweet_stream.json");
    let tweets = JSON.parse(jsonTweet);
    return tweets;
}

export function populateDb(tweets) {
    if (tweets == null) {
        throw new ArgumentException("valid tweets argument required");
    }

    let formatted = formatTweet(tweets[0], "object");
    console.log(formatted);
    Tweets.insert(formatted);

    // for (var i = 0; i < tweets.length; i++) {
    //     var tweet = tweets[i];
    //     Tweets.insert

    // }
}

export function outputTweets(tweets, formatAs) {
    if (tweets == null) {
        throw new ArgumentException("valid tweets argument required");
    }

    for (let i = 0; i < tweets.length; i++) {
        let formatted = formatTweet(tweets[i], formatAs);
        if (formatAs === "json") {
            try {
                let fs = Npm.require("fs");
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

