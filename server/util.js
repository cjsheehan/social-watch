function jsonRootType(json) {
  if (json && Array === json.constructor) {
    return 'array';
  } else {
    return 'object';
  }
}

function ArgumentNullException(message) {
   this.message = message;
   this.name = "ArgumentNullException";
}

function ArgumentException(message) {
   this.message = message;
   this.name = "ArgumentException";
}

