//session

let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

let expressSession = require('express-session');

let app = express();

app.set('port',process.env.PORT || 3000);
app.use(static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave :true,
    saveUninitialized:true
}));


let router = express.Router();

router.route('/process/product').get(function(req,res){
    console.log('/process/product 라우팅 함수 호출됨.');
    //req.session에 세션 정보가 들어가 있음
    //로그인 되어 있으면 상품 페이지, 아니면 로그인 페이지로 이동
    if(req.session.user){
        res.redirect('/product.html');
    }else{
        res.redirect('/login2.html');
    }
});

router.route('/process/login').post(function(req,res){
    console.log('/process/login 라우팅 함수 호출됨');
    let paramId=req.body.id || req.query.id;
    let paramPw = req.body.password||req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPw);

    if(req.session.user){
        console.log('이미 로그인되어 있습니다.');
        res.redirect('/product.html');
    }else{
        req.session.user = {
            id:paramId,
            name:'소녀시대',
            auuthorized:true
        };
        res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<p>ID : '+paramId+'</p>');
        res.write('<br><br><a href="/process/product">상품 페이지로 이동하기</a>');
        res.end();
    }
});

router.route('/process/logout').get(function(req,res){
    console.log('/process/logout 라우팅 함수 호출됨');
    if(req.session.user){
        console.log('로그아웃합니다.');
        req.session.destroy(function(err){
            if(err){
                console.log('세션 삭제 시 에러 발생.');
                return;
            }
            console.log('세션 삭제 성공.');
            res.redirect('/login2.html');
            
        });
    }else {
        console.log('로그인되어 있지 않습니다.');
        res.redirect('/login2.html');
    }


});

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