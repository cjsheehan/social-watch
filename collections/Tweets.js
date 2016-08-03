import { Mongo } from "meteor/mongo";

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

