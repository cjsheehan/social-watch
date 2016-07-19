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


Twitter.postAsync(client, 'statuses/update', {status: 'Test for app'},  function(error, tweet, response){
  console.log(response);  // Raw response object. 
  if(error) throw error;
  console.log(tweet);  // Tweet body. 
  console.log(response);  // Raw response object. 
});
