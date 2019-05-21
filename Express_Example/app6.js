let express = require('express');
let http = require('http');
let app = express();
app.set('port', process.env.PORT||3000);
app.use(function(req,res,next){
    console.log('첫번째 미들웨어 호출됨.');
    let userAgent = req.header('user-Agent');
    //http://localhost:3000/?name=mike 이러면 paramName가 mike가 됨
    let paramName = req.query.name;
    //데스크탑이냐 모바일이냐에 따라 다른 반응을 보낼 수 있다.
    
    res.send('<h3>서버에서 응답. user-Agent -> ' + 
    userAgent +'</h3> <h3>Param Name -> '+ paramName +'</h3>');
});

let server = http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버 호출됨 -> ' + app.get('port'));
});