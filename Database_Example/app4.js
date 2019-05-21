
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
            id : {type : String, required:true, unique:true},
            password:{type:String, required:true},
            name:{type:String, index:'hashed'},
            age: {type:Number, 'default':-1},
            created_at: {type:Date, index:{unique:false},'default': Date.now()},
            updated_at: {type:Date, index:{unique:false},'default': Date.now()}
        });
        console.log('UserSchema 정의함');

        //함수를 등록 -> 모델 객체에서 이 메소드를 사용할 수 있다.
        UserSchema.static('findById', function(id, callback){
            return this.find({id:id},callback);
        });

        /*
        //이렇게 사용할 수도 있다.
        UserSchema.statics.findById = function(id, callback){
            return this.find({id:id},callback);
        }
        */

        UserSchema.static('findAll',function(callback){
            return this.find({},callback);
        });

        UserModel = mongoose.model('users2', UserSchema);
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

router.route('/process/listuser').post(function(req,res){
    console.log('/process/listuser 라우팅 함수 호출됨');

    if(database){
        UserModel.findAll(function(err, results){
            if(err){
                console.log('에러 발생.');
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }

            if(results){
                console.dir(results);
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write("<h3>사용자 리스트</h3>")
                res.write("<div><ul>");
                for(let i =0; i<results.length; i++){
                    let curId = results[i]._doc.id;
                    let curName = results[i]._doc.name;
                    res.write("     <li>#" + i + " -> " + curId + ", " + curName + "</li>")
                }
                res.write("</div></ul>");
                res.end();
            }

            else{
                console.log('에러 발생.');
                res.writeHead(200,{'Content-Type':"text/html;charset=utf8"});
                res.write('<h1>조회된 사용자 없음.</h1>');
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
})


app.use('/',router);

let authUser = function(db, id, password, callback){
    console.log('authUser 호출됨. : ' + id + ', ' + password);
    UserModel.findById(id, function(err, results){
        if(err){
            callback(err,null);
            return;
        }

        console.log('아이디 %s로 검색됨');
        if(results.length>0){
            if(results[0]._doc.password === password){
                console.log('비밀번호 일치함.');
                callback(null, results);
            }
            else{
                console.log('비밀번호 일치하지 않음');
                callback(null,null);
            }    
        }
        else{
            console.log('아이디 일치하는 사용자 없음');
            callback(null,null);
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