
let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');

//에러 핸들러 모듈 사용
let expressErrorHandler = require('express-error-handler');


let user = require('./routes/user');

// 암호화 모듈
let crypto = require('crypto');

//mongoose 모듈 사용
let mongoose = require('mongoose');

let database;


function createUserSchema(database){
    database.UserSchema = require('./database/user_schema').createSchema(mongoose);
    database.UserModel = mongoose.model('users5', database.UserSchema);
    console.log('UserModel 정의함');
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


//몽고디비에 연결
function connectDB(){
    let databaseUrl = 'mongodb://localhost:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('open', function(){
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        createUserSchema(database);
    });
    
    database.on('disconnected',function(){
        console.log('데이터베이스 연결 끊어짐');
        
    });

    database.on('error',function(){
        console.log('mongoose 연결 에러');
    });

    app.set('database', database);
}




let router = express.Router();

router.route('/process/login').post(user.login);

router.route('/process/adduser').post(user.adduser);

router.route('/process/listuser').post(user.listuser);


app.use('/',router);



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