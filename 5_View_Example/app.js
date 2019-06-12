
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

//설정
let config = require('./configure/config');


let database_loader = require('./database/database_loader');
let route_loader = require('./routes/route_loader');

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

app.set('views', __dirname + '/views');
//app.set('view engine','ejs');
app.set('view engine','pug');

console.log("config.server_port -> " + config.server_port);
app.set('port', config.server_port || 3000);

app.use(static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave :true,
    saveUninitialized:true
}));


route_loader.init(app,express.Router());

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
    database_loader.init(app, config);
});