
let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');

let expressErrorHandler = require('express-error-handler');

//mongodb 모듈 사용
let MongoClient = require('mongodb').MongoClient;

let database;

//몽고디비에 연결
function connectDB(){
    let databaseUrl = 'mongodb://localhost:27017';
    MongoClient.connect(databaseUrl, function(err,client){
        let db = client.db('local');
        if(err){
            console.log('데이터베이스 연결시 에러 발생함');
            return;
        }
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        database = db;
      
    });
    
}

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

router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅 함수 호출됨');
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    if(database){
        authUser(database, paramId, paramPassword, function(err, docs)
        {
            if(err){
                console.log('에러 발생.');
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }

            if(docs){
                console.dir(docs);
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자 : '+ docs[0].name +'</p></div>');
                res.write('<br><br><a href = "/login.html">다시 로그인하기</a>')
                res.end();
                return;
            }
            else{
                console.log('에러 발생.');
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안됨</h1>');
                res.end();
      
            }
        });
    }

    else{
        console.log('에러 발생.');
        res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
        res.write('<h1>데이터 베이스 연결 안됨</h1>');
        res.end();
    }
});


app.use('/',router);

let authUser = function(db, id, password, callback){
    console.log('authUser 호출됨. : ' + id + ', ' + password);
    let users = db.collection('users');
    users.find({"id":id, "password": password}).toArray(function(err, docs){
        if(err){
            callback(err, null);
            return;
        }
        
        if(docs.length > 0){
            console.log('일치하는 사용자를 찾음.');
            callback(null, docs);
        }
        else{
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });
};

let errorHandler = expressErrorHandler({
    static: {
        '404' : path.join(__dirname,'public') + '/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

let server = http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버 호출됨 -> ' + app.get('port'));
    //웹서버가 실행되면 데이터베이스 연결
    connectDB();
});