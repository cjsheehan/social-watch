import { chai } from "meteor/practicalmeteor:chai";
import StubCollections from "meteor/hwillson:stub-collections";
import { Tweets } from "/collections/Tweets";
import { insertTweet, isExisting } from "./db";
import { DuplicateDocException } from "/lib/exceptions";

describe("Tweets db", function () {

	it("disallow duplicate tweet insert", function () {
		let tweet = {
			userName: "Mr X",
			text: "Test tweet",
			hashTags: [],
			createdAt: "Fri Jul 29 18:22:32 +0000 2016",
			location: ["-4.241751", "55.858302"],
			idStr: "123456789012345678"
		};

		StubCollections.stub(Tweets);
		chai.assert.equal(false, isExisting(tweet, Tweets));

		insertTweet(tweet, Tweets);
		chai.assert.equal(true, isExisting(tweet, Tweets));
		
		let actual = false;

		try {
			insertTweet(tweet, Tweets);
		} catch (error) {
			if (error instanceof DuplicateDocException ) {
				actual = true;
			} else {
				throw error;
			}
		}

		chai.assert.equal(true, actual);

		StubCollections.restore();
	});
});