let express = require('express');
let http = require('http');

let app = express();
//포트라고 하는 시스템 환경변수를 사용해라. 지정되 있지 않으면 3000을 사용
app.set('port', process.env.PORT || 3000);

let server = http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
    
});

