TweetSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  entities: {
    type: Object,
    label: "Entities"
  },
  loc: {
    type: String,
    label: "Location"
  },
  id_str: {
    type: String,
    label: "TwitId"
  },
  coord: {
    type: [Number]
  }

});

EntitySchema = new SimpleSchema({

});

// type

// Type can be a standard Javascript object like:

// String
// Number
// Boolean
// Object

// coordinates

// "coordinates":  --> Collection of Float
// {
//     "coordinates":
//     [
//         -75.14310264,
//         40.05701649
//     ],
//     "type":"Point"
// }

// location code

// tweet - created_at

// entities

// "entities":
// {
//     "hashtags":[],
//     "urls":[],
//     "user_mentions":[]
// }

// id_str, safe tweet uid

// text : str utf8 of tweet
