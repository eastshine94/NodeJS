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
    
    //res.send('<h1>서버에서 응답한 결과입니다. : ' + req.user + '</h1>');
    let person = {name:'소녀시대',age:20}
    //res.send(person);
    
    //동일한 결과지만 객체를 String 값으로 변환해서 보낸것 
    let personStr = JSON.stringify(person);
    // res.send(personStr);

    res.writeHead(200,{"Content-Type":"application/json;charset=utf8"});
    res.write(personStr);
    res.end();
});


let server = http.createServer(app).listen(app.get('port'), function(){
    console.log('express로 웹 서버 실행함 -> '+ app.get('port'));
});

