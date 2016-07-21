import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

var options = {
    consumer_key: Meteor.settings.private.twitter.consumer_key,
    consumer_secret: Meteor.settings.private.twitter.consumer_secret,
    access_token_key: Meteor.settings.private.twitter.access_token,
    access_token_secret: Meteor.settings.private.twitter.access_secret
}

var client = new Twitter(options);
var glasgow_location = '-4.4901557, 55.74857, -3.8721748, 55.9597760';
var uk_location = '-5.6299873, 50.0481060, -1.9385810, 57.6202252';

Twitter.streamAsync(client, 'statuses/filter', {locations: glasgow_location},
 function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

  stream.on('error', function(error) {
    console.log(error);
    throw error;
  });
});
