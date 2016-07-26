// Twitter field consts
const ENTITIES = "entities";
const USER = "user";
const HASH_TAGS = "hashtags";
const TEXT = "text";
const INDICES = "indices";
const NAME = "name";
const CREATED_AT = "created_at";
const ID_STR = "id_str";
const COORDS = "coordinates";
const PLACE = "place";
const TYPE = "type";
const POLYGON = "POLYGON";
const ATTR = "attributes";
const BBOX = "bounding_box";


export default function getData() {
  let jsonTweet = Assets.getText('twitter.json');
  let data = JSON.parse(jsonTweet);
  for (let index = 0; index < data.length; index++) {
    let tweet = data[index];
    let hashTags = getHashTags(tweet);
    let userName = getUserName(tweet);
    let createdAt = getCreatedAt(tweet);
    let location = getLocation(tweet);
    let text = getText(tweet);

    console.log(userName, createdAt, text, JSON.stringify(location));
  }
}

function getText(data) {
  if (data === undefined) {
    console.log("data is undefined in getCreatedAt()");
    return "";
  }

  return data[TEXT];
}

function getCreatedAt(data) {
  if (data === undefined) {
    console.log("data is undefined in getCreatedAt()");
    return "";
  }

  return data[CREATED_AT];
}

function getUserName(data) {
  if (data === undefined) {
    console.log("data is undefined in getUser()");
    return "";
  }

  return data[USER][NAME];
}

function getHashTags(data) {
  if (data === undefined) {
    console.log("data is undefined in getHashTags()");
    return [];
  }

  let hashTags = data[ENTITIES][HASH_TAGS];
  if (hashTags && Array.isArray(hashTags)) {
    return hashTags;
  } else {
    return [];
  }
}

function getLocation(data) {
    let location = getPoint(data);
    if(location === null) {
      location = getBBox(data);
    }
    return location;
}

function getBBox(data) {
  if (data[PLACE] && data[PLACE][BBOX]) {
    return data[PLACE][BBOX];
  } else {

    return null;
  }
}

function getPoint(data) {
  if (data[COORDS] && data[COORDS][COORDS]) {
      return data[COORDS];
  } else {
    return null;
  }
}

function outHashTags(data) {
  if (data && data.length > 0) {
    for (let index = 0; index < data.length; index++) {
      console.log("outHashTags " + data[index][TEXT] + ' ' + data[index][INDICES]);
    }
  }
}
