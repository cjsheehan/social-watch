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

// fs.writeFile("../../../../../../../test.txt", , function(err) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// }); 

// var fs = Npm.require('fs');
