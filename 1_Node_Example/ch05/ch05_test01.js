let http = require('http');
//웹서버 객체 return
let server = http.createServer();

//ip 할당
let host = 'localhost';
let port = 3000;
//3000번 포트에서 대기
//50000은 백로그, 동시에 접속할 수 있는 클라이언트 수
server.listen(port,host,'50000', function(){
    console.log('웹서버가 실행되었습니다. -> ' +host+':'+port);
});

