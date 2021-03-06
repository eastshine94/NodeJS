let local_login = require('./passport/local_login');
let local_signup = require('./passport/local_signup');

module.exports = function(app, passport){
    console.log('configure/passport 호출됨.');
    
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

    
    //----- Passport Strategy 설정 -----//

    passport.use('local-login', local_login);
    passport.use('local-signup', local_signup);
    console.log('passport strategy 등록됨.');
};