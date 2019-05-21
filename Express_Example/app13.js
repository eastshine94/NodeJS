//파일 업로드

let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');

let multer = require('multer');
let fs = require('fs');

//다른 웹서버를 접속할 때 cors가 사용된다. 다중서버접속
let cors = require('cors');

let app = express();

app.set('port',process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads',static(path.join(__dirname,'uploads')));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave :true,
    saveUninitialized:true
}));

app.use(cors());

let storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,path.join(__dirname,'uploads'));
    },
    filename:function(req,file,callback){
        //덮어쓰기 문제를 벗어나기 위해 뒤에 현재 시간을 추가한다.
        // callback(null, file.originalname + Date.now());
        
        //확장자를 유지하고 싶을 때
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname,extension);
        
        callback(null, basename+ Date.now() + extension);
    }
});

let upload = multer({
    storage:storage,
    limits:{
        files:10,
        fileSize:1024*1024*1024
    }
});

let router = express.Router();

router.route('/process/photo').post(upload.array('photo',1), 
function(req,res){
    console.log('/process/photo 라우팅 함수 호출됨');
    
    let files = req.files;
    console.log('====== 업로드된 파일 =====');
    if(files.length>0){
        console.dir(files[0]);
    }
    else{
        console.log('파일이 없습니다');
    }

    let originalname;
    let filename;
    let mimetype;
    let size;

    if(Array.isArray(files)){
        for(let i = 0;i<files.length;i++){
            originalname = files[i].originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }
    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>파일 업로드 성공</h1>");
    res.write("<p>원본 파일 : "+ originalname + "</p>");
    res.write("<p>지정 파일 : "+ filename + "</p>");
    res.end();
});


app.use('/',router);

app.all('*',function(req,res){
    res.status(404).send('<h1>요청하신 페이지를 찾을수 없습니다.</h1>')
});


let server = http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버 호출됨 -> ' + app.get('port'));
});