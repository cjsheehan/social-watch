import { ArgumentException } from "/lib/exceptions";
import { stopList } from "./stopList";

let rxClean = /[\[\]\\{}.,\/!$%\^&\*;:=\-_'`~()]/g;
let rxAsciiOnly = /[^\x00-\x7F]/g;

export function wordFrequency(text, asArray = true) {
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

    if(asArray) {
        return toArray(frequency);

    } else {
        return frequency;
    }
}

export function toArray(frequencyList) {
    if (frequencyList == null) {
        throw new Error("toArray() requires valid wordList arg");
    }

    // map to array
    let mapped = Object.keys(frequencyList).map(function (data) {
        return [data, frequencyList[data]];
    });

    // sort by descending frequency
    mapped.sort(function (a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] > b[1]) ? -1 : 1;
        }
    });

    return mapped;
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
    let cleaned = text.replace(rxAsciiOnly, "")
                    .replace(rxClean, "")
                    .replace(/\s+/g, " ");
                    
    return cleaned;
}

export function getWords(text) {
    if(text == null) {
        return []; 
    }
    let words = text.match(/\S+/g);
    return words;
}


