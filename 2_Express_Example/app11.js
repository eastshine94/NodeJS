//cookie

let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');



let app = express();

app.set('port',process.env.PORT || 3000);
app.use(static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());

let router = express.Router();

router.route('/process/setUserCookie').get(function(req,res){
    console.log('/process/setUserCookie 라우팅 함수 호출됨');
    
    res.cookie('user',{
        id:'mike',
        name:'소녀시대',
        auuthorized:true
    });
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function(req,res){
    console.log('/process/showCookie 라우팅 함수 호출됨');
    res.send(req.cookies);

});

app.use('/',router);

app.all('*',function(req,res){
    res.status(404).send('<h1>요청하신 페이지를 찾을수 없습니다.</h1>')
});


let server = http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버 호출됨 -> ' + app.get('port'));
});