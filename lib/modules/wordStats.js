import { ArgumentException } from "/lib/exceptions";

let rxClean = /[\[\]\\{}.,\/#!$%\^&\*;:=\-_`~()]/g;
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

    return frequency;
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
    return text.replace(rxClean, "");
}

export function getWords(text) {
    if(text == null) {
        return []; 
    }
    let words = text.match(/\S+/g);
    return words;
}


