let http = require('http');
let fs = require('fs');
let server = http.createServer();

let host = 'localhost';
let port = 3000;

server.listen(port, host, 50000, function(){
    console.log('웹서버 실행됨 -> ' + host + ':'+ port);
});


server.on('connection',function(socket){
    console.log('클라이언트가 접속했습니다. -> ' + socket.address);
   
});


server.on('request', function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.');
    //console.dir(req);
    let filename = './image/dog.jpg'
    fs.readFile(filename, function(err,data){
        res.writeHead(200,{'Content-Type':"image/jpg"});
        res.write(data);
        
        res.end();
    });


})