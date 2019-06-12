//라우팅
let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');

//post 방식은 http의 body의 값을 사용
let bodyParser = require('body-parser');

let app = express();
app.set('port',process.env.PORT||3000);
app.use(static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

let router = express.Router();
router.route('/process/login').post(function(req,res){
    console.log('/process/login 라우팅 함수에서 받음');
    let paramId = req.body.id||req.query.id;
    let paramPw = req.body.password || req.query.password;
    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>"+ paramId +"</p></div>");
    res.write("<div><p>"+ paramPw +"</p></div>");
    res.end();
});

app.use('/',router);

app.all('*',function(req,res){
    res.status(404).send('<h1>요청하신 페이지를 찾을수 없습니다.</h1>')
});

let server = http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버 호출됨 -> ' + app.get('port'));
});