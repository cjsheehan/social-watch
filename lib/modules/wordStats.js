import { ArgumentException } from "/lib/exceptions";

let rxClean = /[\[\]\\{}.,\/#!$%\^&\*;:=\-_`~()]/g;
let rxAsciiOnly = /[^\x00-\x7F]/g;
let stopList = [
    "cat",
    "dog"
];

export function wordFrequency(text) {
    let words = [];
    let frequency = {};

    if (text == null) {
        throw new ArgumentException("text argument must be provided");
    } else if(text === "") {
        return {};
    }

    text = text.toLowerCase();
    text = clean(text);
    words = removeStop(text);
    words.forEach(function(word) {
        if (!frequency[word]) {
            frequency[word] = 0;
        }
        frequency[word] += 1;
    });

    let wordList = Object.keys(frequency).map(function(data) {
        return [data, frequency[data]];
    });

    wordList.sort(function(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] > b[1]) ? -1 : 1;
        }
    });

    return wordList;
}

export function removeStop(text) {
    if (text == null) {
        throw new ArgumentException("text argument must be provided");
    }

    let preWords = getWords(text);
    let postWords = [];
    for (var i = 0; i < preWords.length; i++) {

        let isStop = false;
        for (var j = 0; j < stopList.length && isStop === false; j++) {
            if (preWords[i] === stopList[j]) {
                isStop = true;
            }
        }

        if (!isStop) {
            postWords.push(preWords[i]);
        }
        
    }

    return postWords;
}

export function clean(text) {
    if (text == null) {
        return "";
    }
    let cleaned = text.replace(rxAsciiOnly, "");
    return cleaned.replace(rxClean, "");
}

export function getWords(text) {
    if(text == null) {
        return []; 
    }
    let words = text.match(/\S+/g);
    return words;
}

export function sortDescending(frequencyList) {
    if (frequencyList == null) {
        throw new ArgumentException("frequencyList must be provided");
    }


    let words = text.match(/\S+/g);
    return words;
}


