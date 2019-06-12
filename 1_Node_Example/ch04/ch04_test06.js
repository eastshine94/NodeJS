let fs = require('fs');
//readfile의 경우 return 값이 없고, 콜백함수를 실행한다.
//비동기식 I/O
fs.readFile('./package.json','utf8',function(err,data){
    console.log(data);
});