import { Mongo } from "meteor/mongo";

export const Tweets = new Mongo.Collection("tweets");

TweetSchema = new SimpleSchema({
  [USER]: {
    type: String,
    label: "UserName"
  },
  [ID_STR]: {
    type: String,
    label: "IdStr"
  },
  [LOCATION]: {
    type: [Number],
    label: "Location"
  },
  [TEXT]: {
    type: String,
    label: "Text"
  },
  [HASH_TAGS]: {
    type: [String],
    label: "HashTags"
  }
});

Tweets.attachSchema(TweetSchema);

