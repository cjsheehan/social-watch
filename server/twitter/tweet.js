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

function getData() {
	let jsonTweet = Assets.getText('twitter.json');
	let data = JSON.parse(jsonTweet);
	for (let index = 0; index < data.length; index++) {
		let tweet = data[index];
		let hashTags = getHashTags(tweet);
		let userName = getUserName(tweet);
		let createdAt = getCreatedAt(tweet);
		let location = getLocation(tweet);
		let text = getText(tweet);
		let centre = "";

		try {
			if (location[TYPE] !== POLYGON) {
				centre = centreOf(location);
			} else {
				centre = [location[COORDS][0][0], location[COORDS][0][1]];
			}
		} catch (e) {
			if (e instanceof ArgumentException) {
				console.log(e.message);
			}
		}

		console.log(userName, createdAt, text, centre);
	}
}

export function centerOf(bbox) {
	if (!bbox) {
		throw new ArgumentException("bbox is invalid");
	}
	console.log("centreOf", bbox[COORDS][0][0]);
	let long = "";
	let lat = "";
	if (bbox[COORDS] && bbox[TYPE] === POLYGON) {
		let se = bbox[COORDS][0][0];
		let sw = bbox[COORDS][0][1];
		let nw = bbox[COORDS][0][2];
		let ne = bbox[COORDS][0][3];
		
		long = avg(se[0], ne[0]);
		lat = avg(se[1], sw[1]);
		centre = [long, lat];

	} else {
		throw new ArgumentException("bbox doesn't contain a valid polygon");
	}
	return [long, lat];
}

export function avg(a, b) {
	if (!a || !b) {
		throw new ArgumentException("valid a & b are required");
	}
	return ((a + b) / 2).toFixed(6);
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
	if (location === null) {
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


