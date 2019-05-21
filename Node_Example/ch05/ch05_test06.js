let http = require('http');
let option = {
    host:'www.google.com',
    port:80,
    path:'/'
};

let req = http.get(option,function(res){
    let resData = '';
    res.on('data',function(chunk){
        resData += chunk;
    });
    res.on('end',function(){
        console.log(resData);
    });
    req.on('error', function(err){
        console.log('에러 발생 : ' + err.message);
    })
})