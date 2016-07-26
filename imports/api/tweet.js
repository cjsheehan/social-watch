// Twitter files consts
const ENTITIES = "entities";
const HASH_TAGS = "hashtags";
const TEXT = "text";
const INDICES = "indices";
const NAME = "name";


export default function getData() {
  var jsonTweet = Assets.getText('twitter.json');
  var data = JSON.parse(jsonTweet);
  for (var index = 0; index < data.length; index++) {
    var tweet = data[index];
    var hashTags = getHashTags(tweet);
    if (hashTags) {
      outHashTags(hashTags);
    } else {
      console.log("hashtags undef" + index);
    }

  }
}

function getHashTags(data) {
  if (data === undefined) {
    console.log("data is undefined in getHashTags()");
    return [];
  }

  var hashTags = data[ENTITIES][HASH_TAGS];
  if (hashTags && Array.isArray(hashTags)) {
    return hashTags;
  } else {
    return [];
  }
}

function outHashTags(data) {
  if (data && data.length > 0) {
    for (var index = 0; index < data.length; index++) {
      console.log("outHashTags " + data[index][TEXT] + ' ' +  data[index][INDICES]);
    }
  }
}
