
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


//----- passport 초기화 -----//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//----- Passport Strategy 설정 -----//
let LocalStrategy = require('passport-local').Strategy;

passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    console.log('passport의 local login 호출됨 : ' + email + ', ' + password);
    let database = app.get('database');
    database.UserModel.findOne({'email': email}, function(err, user){
        if(err){
            console.log('에러 발생함.');
            return done(err);
        }
        
        if(!user){
            console.log('사용자 정보가 일치하지 않습니다.');
            return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
        }

        let authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if(!authenticated){
            console.log('비밀번호가 일치하지 않습니다.');
            return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));

        }

        console.log('아이디와 비밀번호가 일치합니다.');
        return done(null,user);
    });
}));

passport.use('local-signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback: true
}, function(req, email, password, done){
    let paramName = req.body.name || req.query.name;
    console.log('passport의 local-singup 호출됨 : ' + email + ', ' + password + ', ' + paramName);

    let database = app.get('database');
    database.UserModel.findOne({'email':email},function(err,user){
        if(err){
            console.log('에러 발생');
            return done(err);
        }
        if (user){
            console.log('기존에 계정이 있습니다.');
            return done(null, false, req.flash('signupMessage','계정이 이미 있습니다.'));
        }else{
            let user = new database.UserModel({
                'email':email,
                'password':password,
                'name' : paramName
            });
            user.save(function(err){
                if(err){
                    console.log('데이터베이스에 저장 시 에러');
                    return done(null, false, req.flash('signupMessage', '사용자 정보 저장 시 에러가 발생했습니다.'));

                }
                console.log('사용자 데이터 저장함');
                return done(null, user);
            });
        }
    });
}));

passport.serializeUser(function(user, done){
    console.log('serializeUser 호출됨.');
    console.dir(user);
    done(null, user);
});

passport.deserializeUser(function(user, done){
    console.log('deserializeUser 호출됨');
    console.dir(user);

    done(null, user);

});


let router = express.Router();
route_loader.init(app,router);

//===== 회원가입과 로그인 라우팅 함수 =====//
router.route('/').get(function(req, res){
    console.log('/ 패스로 요청됨.');
    
    res.render('index.ejs');
});


router.route('/login').get(function(req, res){
    console.log('/login 패스로 GET 호출됨.');
    res.render('login.ejs',{message: req.flash('loginMessage')});
});


router.route('/login').post(passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failuerFlash: true
}));



router.route('/signup').get(function(req, res){
    console.log('/signup 패스로 GET 요청됨.');
    res.render('signup.ejs', {message: req.flash('signupMessage')});
});

router.route('/signup').post(passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failuerFlash: true
}));



router.route('/profile').get(function(req, res){
    console.log('/profile 패스로 GET 요청됨.');
    
    console.log('req.user 객체 정보');
    console.dir(req.user);

    if(!req.user){
        console.log('사용자 인증 안된 상태임');
        res.redirect('/');
    } else{
        console.log('사용자 인증된 상태임');
        
        if(Array.isArray(req.user)){
            res.render('profile.ejs',{user:req.user[0]._doc});
        } else{
            res.render('profile.ejs', {user: req.user});
        }
    }
});

router.route('/logout').get(function(req, res){
    console.log('/logout 패스로 GET 요청됨.');

    req.logout();
    res.redirect('/');
});




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