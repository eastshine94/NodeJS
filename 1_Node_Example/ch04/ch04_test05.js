let fs = require('fs');
//동기식 I/O
//값이 return 된다.
let data = fs.readFileSync('./package.json','utf-8');
console.log(data);

