import { CAT_FORMAT } from "/lib/constants";


const moment = require("moment");

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

export function sortByDate(tweets) {
    return tweets.sort(function (a, b) {
        let aDate = moment(a.createdAt, [CAT_FORMAT], "en");
        let bDate = moment(b.createdAt, [CAT_FORMAT], "en");
        if (aDate.isSame(bDate)) {
            return 0;
        }
        else {
            return (bDate.isBefore(aDate)) ? -1 : 1;
        }
    });
}

export function before(date) {
    return moment(date).format("YYYY-MM-DD");
}

export function formatDate(date) {
    return moment(date, [CAT_FORMAT], "en").toString();
}

export function isBetween(date, start, end) {
    if ((date.getTime() <= end.getTime() && date.getTime() >= start.getTime())) {
        return true;
    } else { 
        return false;
    }
}

export function parseTwitterDate(text) {
    return new Date(Date.parse(text));
}
