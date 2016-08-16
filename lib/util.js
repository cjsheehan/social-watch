export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}
