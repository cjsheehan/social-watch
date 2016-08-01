/* eslint-disable no-unused-vars*/
export function ArgumentNullException(message) {
    this.message = message;
    this.name = "ArgumentNullException";
}

export function ArgumentException(message) {
    this.message = message;
    this.name = "ArgumentException";
}

export function DuplicateDocException(message) {
    this.message = message;
    this.name = "DuplicateDocException";
}

/* eslint-enable no-unused-vars*/