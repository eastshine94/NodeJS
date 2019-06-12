
let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');

let expressErrorHandler = require('express-error-handler');

//mongoose 모듈 사용
let mongoose = require('mongoose');

let database;
let UserSchema;
let UserModel;

//몽고디비에 연결
function connectDB(){
    let databaseUrl = 'mongodb://localhost:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('open', function(){
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        
        UserSchema= mongoose.Schema({
            id : String,
            name : String,
            password : String
        });
        console.log('UserSchema 정의함');

        UserModel = mongoose.model('users', UserSchema);
        console.log('UserModel 정의함');
    });
    
    database.on('disconnected',function(){
        console.log('데이터베이스 연결 끊어짐');
        
    });

    database.on('error',function(){
        console.log('mongoose 연결 에러');
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

router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 라우팅 함수 호출됨');
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    let paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
    
    if(database){
        addUser(database, paramId, paramPassword, paramName, function(err, result){
            if(err){
                console.log('에러 발생.');
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }

            if(result){
                console.dir(result);
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : '+ paramName +'</p></div>');
                res.end();
                return;
            }
            else{
                console.log('에러 발생.');
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 안됨</h1>');
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
    
    UserModel.find({"id":id,"password":password}, function(err,docs)
    {
        if(err){
            callback(err,null);
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

let addUser = function(db, id, password, name, callback){
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);
    let user = new UserModel({"id": id, "password": password, "name": name})
    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        }

        console.log('사용자 데이터 추가됨');
        callback(null, user);
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