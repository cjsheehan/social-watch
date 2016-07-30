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
const POLYGON = "Polygon";
const POINT = "Point";
const ATTR = "attributes";
const BBOX = "bounding_box";

export function Tweet(userName, text, hashTags, createdAt, location) {
	this.userName = userName;
	this.text = text;
	this.hashTags = hashTags;
	this.createdAt = createdAt;
	this.location = location;
}

function getData() {
	let jsonTweet = Assets.getText("twitter.json");
	let data = JSON.parse(jsonTweet);
	for (let index = 0; index < data.length; index++) {
		let tweet = data[index];
		let hashTags = getHashTags(tweet);
		let userName = getUserName(tweet);
		let createdAt = getCreatedAt(tweet);
		let location = getLocation(tweet);
		let text = getText(tweet);
		let center = "";

		try {
			if (location[TYPE] !== POLYGON) {
				center = centerOf(location);
			} else {
				center = [location[COORDS][0][0], location[COORDS][0][1]];
			}
		} catch (e) {
			if (e instanceof ArgumentException) {
				console.log(e.message);
			}
		}

		console.log(userName, createdAt, text, center);
	}
}

export function formatTweet(tweet) {
	let userName = getUserName(tweet);
	let createdAt = getCreatedAt(tweet);
	let hashTags = getHashTags(tweet);
	let location = getLocation(tweet);
	let text = getText(tweet);

	let formatted = "userName: " + userName + "\n" + "createdAt: " + createdAt + "\n" + "location: " + location + "\n" + "text: " + text + "\n";
}

export function centerOf(bbox) {
	if (bbox == null) {
		throw new ArgumentException("bbox is invalid");
	}

	let long = "";
	let lat = "";
	if (bbox[COORDS] && bbox[TYPE] === POLYGON) {
		let se = bbox[COORDS][0][0];
		let sw = bbox[COORDS][0][1];
		let nw = bbox[COORDS][0][2];
		let ne = bbox[COORDS][0][3];

		long = avg(sw[0], nw[0]);
		lat = avg(se[1], sw[1]);
		center = [long, lat];

	} else {
		throw new ArgumentException("bbox does not contain a valid polygon");
	}
	return [long, lat];
}

export function avg(a, b) {
	if (a == null || isNaN(a)) {
		throw new ArgumentException("valid number a is required");
	} else if (b == null || isNaN(b)) {
		throw new ArgumentException("valid number b is required");
	}
	return ((a + b) / 2).toFixed(6);
}

export function getText(data) {
	if (data == null) {
		throw new ArgumentException("valid data is required");
	}

	if (data[TEXT]) {
		return data[TEXT];
	} else {
		return "";
	}
}

export function getCreatedAt(data) {
	if (data == null) {
		throw new ArgumentException("valid data is required");
	}

	if (data[CREATED_AT]) {
		return data[CREATED_AT];
	} else {
		return "";
	}
}

export function getUserName(data) {
	if (data == null) {
		throw new ArgumentException("valid data is required");
	}

	if (data[USER] && data[USER][NAME]) {
		return data[USER][NAME];
	} else {
		return "";
	}
}

export function getHashTags(data) {
	if (data == null) {
		throw new ArgumentException("valid data is required");
	}

	let tags = [];
	if (data[ENTITIES] && data[ENTITIES][HASH_TAGS]) {
		for (var i = 0; i < data[ENTITIES][HASH_TAGS].length; i++) {
			tags[i] = data[ENTITIES][HASH_TAGS][TEXT][i];
		}
		return tags;
	} else {
		return tags;
	}
}

export function getLocation(data) {
	let location = getPoint(data);
	if (location == null) {
		let bbox = getBBox(data);
		console.log("getLocation", bbox);
		try {
			location = centerOf(bbox);
		} catch (error) {
			location = null;
		}
	}
	return location;
}

export function getPlaceName(tweet) {
	if (!tweet) {
		throw new ArgumentException("valid tweet required");
	}

	if (tweet[PLACE] && tweet[PLACE][NAME]) {
		return tweet[PLACE][NAME];
	} else {
		return null;
	}
}

function getBBox(data) {
	if (data[PLACE] && data[PLACE][BBOX]) {
		return data[PLACE][BBOX];
	} else {
		return null;
	}
}

export function getPoint(data) {
	if (data == null) {
		throw new ArgumentException("valid data is required");
	}

	if (data[COORDS] && data[COORDS][TYPE] && data[COORDS][TYPE] === POINT && data[COORDS][COORDS]) {
		return data[COORDS][COORDS];
	} else {
		return null;
	}
}

function outHashTags(data) {
	if (data && data.length > 0) {
		for (let index = 0; index < data.length; index++) {
			console.log("outHashTags " + data[index][TEXT] + " " + data[index][INDICES]);
		}
	}
}


