import { Mongo } from "meteor/mongo";

export const Tweets = new Mongo.Collection("tweets");
export const SearchResults = new Mongo.Collection("searchResults");

TweetSchema = new SimpleSchema({
  userName: {
    type: String,
    label: "UserName"
  },
  idStr: {
    type: String,
    label: "IdStr"
  },
  location: {
    type: [Number],
    label: "Location",
    decimal: true,
    maxCount: 2,
    minCount: 0
  },
  text: {
    type: String,
    label: "Text"
  },
  createdAt: {
    type: Date,
    label: "Created At"
  },
  insertedAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
});

Tweets.attachSchema(TweetSchema);
SearchResults.attachSchema(TweetSchema);
