const moment = require("moment");

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

export function sortByDate(tweets) {
    return tweets.sort(function (a, b) {
        let aDate = moment(a.createdAt).format("MMM DD, HH:mm");
        let bDate = moment(b.createdAt).format("MMM DD, HH:mm");
        return new Date(bDate) - new Date(aDate);
    });
}

export function before(date) {
    return moment(date).format("YYYY-MM-DD");
}

export function formatDate(date) {
    return moment(date, "dd MMM DD HH:mm:ss ZZ YYYY", "en").toDate();
}

