import { Meteor } from 'meteor/meteor';

// import '../imports/api/tweet';
// import getTweets from '../imports/api/util';
import getData from '../imports/api/tweet';


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



var params = {};

// getData();


// Twitter.getAsync(client, 'statuses/home_timeline', params, function(error, tweets, response){
//     if (!error) {
//         var data = JSON.stringify(tweets);
//         fs.appendFile("../../../../../../../json_out.json", data, function(err) {
//             if(err) {
//                 return console.log(err);
//             };
//             console.log("file written");
//         }); 
//     }

// });

// Twitter.getAsync(client, 'favorites/list', function(error, tweets, response){
//     if(error) throw error;
//     fs.writeFile("../../../../../../../json_out.json", tweets, function(err) {
//         if(err) {
//             return console.log(err);
//         }

//         console.log("The file was saved!");
//     }); 
//     console.log("tweets" + tweets);  // The favorites. 
//     // console.log(response);  // Raw response object. 
// });

// console.log(fs);

// Twitter.streamAsync(client, 'statuses/filter', {locations: glasgow_location},
//  function(stream) {
//   stream.on('data', function(tweet) {
//     fs.writeFile("../../../../../../../tweets.txt", tweet, function(err) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// }); 
//     // console.log(tweet.text);
//     console.log(tweet.text);
//     console.log(tweet.place.coordinates);
//     var loc = tweet.place.coordinates;
//     for(var i = 0; i < loc.length; i++){
//         for(var j = 0; j < loc[i].length; j++){
//             console.log(loc[i][j] + ',');
//         }
//     }
//   });

//   stream.on('error', function(error) {
//     console.log(error);
//     throw error;
//   });
// });







