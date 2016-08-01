import { Tweets } from "/collections/Tweets";
import { DuplicateDocException, ArgumentException } from "/lib/exceptions";


export function insertTweet(tweet) {
    if (tweet == null) {
        throw new ArgumentException("valid tweet argument required to insertTweet");
    }

    if (!isExisting(tweet, Tweets)) {
        Tweets.insert(tweet);
    } else {
		throw new DuplicateDocException("tweet with idStr" + tweet.idStr + "already exists in db");
	}
}

export function isExisting(tweet, db) {
	if (tweet == null) {
        throw new ArgumentException("valid tweet argument required to isExisting");
    } else if (db == null) {
		throw new ArgumentException("valid db argument required to isExisting");
	}
    var exists = db.findOne( { idStr: tweet.idStr } );
    if (exists) {
		console.log("true exists");
        return true;
    } else {
		console.log("false exists");
        return false;
    }
}