import { Mongo } from "meteor/mongo";
import { USER, ID_STR, LOCATION, TEXT, CREATED_AT, HASH_TAGS } from "/lib/constants";
import { Tweet } from "/lib/Tweet";

export const Tweets = new Mongo.Collection("tweets");

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
    minCount: 2
  },
  text: {
    type: String,
    label: "Text"
  },
  createdAt: {
    type: String,
    label: "Created At"
  }
});

Tweets.attachSchema(TweetSchema);

