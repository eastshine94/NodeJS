let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');

//post 방식은 http의 body의 값을 사용
let bodyParser = require('body-parser');

let app = express();

app.set('port', process.env.PORT||3000);
//__dirname은 이 js 파일이 있는 경로
//현재 경로에 public를 붙여준다.
//http://localhost:3000/images/dog.jpg 창을 열게 되면 public images에 있는 개 사진이 웹상이 뜨게 된다.

app.use(static(path.join(__dirname,'public')));

//이 경우에는 http://localhost:3000/public/images/dog.jpg
// app.use('/public',static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(req,res,next){
    console.log('첫번째 미들웨어 호출됨.');
    let userAgent = req.header('user-Agent');
    let paramId = req.body.id||req.query.id;

    res.send('<h3>서버에서 응답. user-Agent -> ' + 
    userAgent +'</h3> <h3>Param Name -> '+ paramId +'</h3>');
});

let server = http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버 호출됨 -> ' + app.get('port'));
});