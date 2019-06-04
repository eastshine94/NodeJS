
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

let login_ids = {};


io.sockets.on('connection',function(socket){
    console.log('Connection info -> ' + 
        JSON.stringify(socket.request.connection._peername));
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;

    socket.on('login', function(input){
        console.log('login 받음 -> ' + JSON.stringify(input));
        
        login_ids[input.id] = socket.id;
        socket.login_id = input.id;
        
        sendResponse(socket, 'login', 200, 'OK');

    });

    //클라이언트가 보낸 메시지를 서버가 받고 다른 클라이언트에게 보낸다.
    socket.on('message', function(message){
        console.log('message 받음 -> ' + JSON.stringify(message));
        
        if(message.recepient == 'ALL'){
            console.log('모든 클라이언트에게 메시지 전송함');
            
            io.sockets.emit('message', message);
        } else {
            if(login_ids[message.recepient]){
                io.sockets.connected[login_ids[message.recepient]].emit('message', message);

                sendResponse(socket, 'message', 200, 'OK');
            } else{
                sendResponse(socket, 'message', 400, '수신자 ID를 찾을 수 없습니다.');
            }

        }

    });


    socket.on('room',function(input){
        console.log('room 받음 -> ' + JSON.stringify(input));
        
        if(input.command == 'create'){
            if(io.sockets.adapter.rooms[input.roomId]){
                console.log('이미 방이 만들어져 있습니다.');
            } else{
                console.log('새로 방을 만듭니다.');
                //방을 만든다.
                socket.join(input.roomId);

                let curRoom = io.sockets.adapter.rooms[input.roomId];
                curRoom.id = input.roomId;
                curRoom.name = input.roomName;
                curRoom.owner = input.roomOwner;
            }

            

        } else if(input.command == 'update'){
            let curRoom = io.sockets.adapter.rooms[input.roomId];
            curRoom.id = input.roomId;
            curRoom.name = input.roomName;
            curRoom.owner = input.roomOwner;

        } else if(input.command == 'delete'){
            //room에서 빠져 나옴
            socket.leave(input.roomId);

            if(io.sockets.adapter.rooms[input.roomId]){
                delete io.sockets.adapter.rooms[input.roomId]
            } else{
                console.log('방이 만들어져 있지 않습니다.');
            }
        }

        let rooms = getRoomList();
        let output = {
            command:'list',
            rooms:rooms
        };

        //모든 사용자에게 방의 존재를 알려줌
        io.sockets.emit('room', output);
    });
});

function getRoomList(){
    console.log('getRoomList 호출됨');
    console.log('Room -> ' + JSON.stringify(io.sockets.adapter.rooms));
    
    //socket.io에서 처음부터 만들어진 가상의 방이 있기 때문에 이를 제거하는 작업을 진행해야 한다.
    let rooms = [];
    Object.keys(io.sockets.adapter.rooms).forEach(function(roomId){
        console.log('현재 방 ID : ' + roomId);
        let curRoom = io.sockets.adapter.rooms[roomId];

        let found =false;
        Object.keys(curRoom.sockets).forEach(function(key){
            if(roomId == key){
                found = true;
            }
        });
        if(!found){
            rooms.push(curRoom);
        }
    });
    
    return rooms;
}


function sendResponse(socket, command, code, message){
    let output = {
        command:command,
        code:code,
        message:message
    };

    socket.emit('response', output);
}