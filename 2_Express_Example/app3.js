let http = require('http');
let express = require('express');
let app = express();
app.set('port',process.env.PORT||3000);

app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');
    req.user = 'mike';
    //다음 미들웨어로 감
    next();

});

app.use(function(req,res,next){
    console.log('두번째 미들웨어 호출됨')
    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
    res.end('<h1>서버에서 응답한 결과입니다. : ' + req.user + '</h1>');

});

let server = http.createServer(app).listen(app.get('port'), function(){
    console.log('express로 웹 서버 실행함 -> '+ app.get('port'));
});

