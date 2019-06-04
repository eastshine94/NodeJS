
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

//====== socket.io 사용 =======//
let socketIO = require('socket.io');
let cors = require('cors');


//----- Passport 사용 -----//
let passport = require('passport');
let flash = require('connect-flash');


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
app.set('view engine','ejs');
//app.set('view engine','pug');

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


//====== cors 초기화 ======//
app.use(cors());


//----- passport 초기화 -----//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

let configPassport = require('./configure/passport');
configPassport(app, passport);

let router = express.Router();
route_loader.init(app,router);

let userPassport = require('./routes/user_passport');
userPassport(router, passport);


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


//===== socket.io 서버 시작 ======//
let io = socketIO.listen(server);
console.log('socket.io 요청을 받아들일 준비가 되었습니다.');

io.sockets.on('connection',function(socket){
    console.log('Connection info -> ' + 
        JSON.stringify(socket.request.connection._peername));
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;

    //클라이언트가 보낸 메시지를 서버가 받고 다른 클라이언트에게 보낸다.
    socket.on('message', function(message){
        console.log('message 받음 -> ' + JSON.stringify(message));
        
        if(message.recepient == 'ALL'){
            console.log('모든 클라이언트에게 메시지 전송함');
            
            io.sockets.emit('message', message);
        }

    });
});