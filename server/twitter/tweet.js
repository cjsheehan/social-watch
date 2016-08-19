import { ArgumentException } from "/lib/exceptions";
import { Tweet } from "/lib/Tweet";
import { ENTITIES, USER, HASH_TAGS, TEXT, NAME, CREATED_AT, TW_CREATED_AT, ID_STR, COORDS, PLACE, TYPE, POLYGON, LOCATION, POINT, BBOX} from "/lib/constants";

import { round, formatDate } from "/lib/util";

import { COORD_PRECISION } from "/lib/constants";

export function formatTweet(tweet, formatAs) {
	if (tweet == null) {
		throw new ArgumentException("valid tweet is required");
	} else if (formatAs == null) {
		throw new ArgumentException("valid formatAs argument is required");
	}
	let userName = getUserName(tweet);
	let createdAt = getCreatedAt(tweet);
	let hashTags = getHashTags(tweet);
	let location = getLocation(tweet);
	let text = getText(tweet);
	let idStr = getIdStr(tweet);

	let formatted = "";
	if (formatAs === "string") {
		formatted = [USER] + ": " + userName + "\n" + [CREATED_AT] + ": " + createdAt + "\n" + [LOCATION] + ": " + location + "\n" + [TEXT] + ": " + text + "\n" + [HASH_TAGS] + ": " + hashTags.toString() + [ID_STR] + ": " + idStr;
	} else {
		formatted = new Tweet(userName, text, hashTags, createdAt, location, idStr);
	}

	return formatted;
}

export function getIdStr(tweet) {
	if (tweet == null) {
		throw new ArgumentException("valid tweet is required");
	}

	if(tweet[ID_STR]) {
		return tweet[ID_STR];
	} else {
		return null;
	}
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
	return round(((a + b) / 2), COORD_PRECISION);
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
		return formatDate(data[CREATED_AT]);
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
			tags[i] = data[ENTITIES][HASH_TAGS][i][TEXT];
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
		try {
			location = centerOf(bbox);
		} catch (error) {
			location = [];
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


