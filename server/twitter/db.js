import { DuplicateDocException, ArgumentException } from "/lib/exceptions";

export function insertTweet(tweet, db) {
    if (tweet == null) {
        throw new ArgumentException("valid tweet argument required to insertTweet");
    } else if (db == null) {
		throw new ArgumentException("valid db argument required to isExisting");
	}

    if (!isExisting(tweet, db)) {
        db.insert(tweet);
    } else {
		throw new DuplicateDocException("tweet with idStr " + tweet.idStr + " already exists in db");
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
        return true;
    } else {
        return false;
    }
}