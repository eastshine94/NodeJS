let add = function(req, res){
    console.log('add 함수 호출됨');
    
    let paramName = req.body.name || req.query.name;
    let paramAddress = req.body.address || req.query.address;
    let paramTel = req.body.tel || req.query.tel;
    let paramLongitude = req.body.longitude || req.query.longitude;
    let paramLatitude = req.body.latitude || req.query.latitude;

    console.log('파라미터 : ' + paramName + ', ' + paramAddress + ', ' + paramTel + ', ' + paramLongitude + ', ' + paramLatitude);

    let database = req.app.get('database');
    let params = {
        name:paramName,
        address:paramAddress,
        tel:paramTel,
        geometry: {
            type:'Point',
            coordinates:[paramLongitude, paramLatitude]
        }

    };
    addCoffeeshop(database, params, function(err, result){
        if(err){
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>커피숍 추가 중 에러 발생</h2>');
            res.end();
        }

        if(result){
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>커피숍 추가 성공</h2>');
            res.end();
        } else{
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>커피숍 추가 실패</h2>');
            res.end();
        }
    });
};

let addCoffeeshop = function(database, params, callback){
    console.log('addCoffeeshop 호출됨.');

    let coffeeshop = new database.CoffeeShopModel(params);

    coffeeshop.save(function(err){
        if(err){
            console.log('에러 발생.');
            callback(err, null);
            return;
        }

        console.log('커피숍 데이터 추가함');
        callback(null, coffeeshop);
    })
};

let list = function(req, res){
    console.log('list 함수 호출됨');

    let database = req.app.get('database');
    database.CoffeeShopModel.findAll(function(err, results){
        if(err){
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>커피숍 조회 중 에러 발생</h2>');
            res.end();
        }

        if(results){
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>커피숍 리스트</h2>');
            res.write('<div><ul>');
            for(let i = 0; i<results.length; i++){
                let curName = results[i]._doc.name;
                let curAddress = results[i]._doc.address;
                let curTel = results[i]._doc.tel;
                let curLongitude = results[i]._doc.geometry.coordinates[0];
                let curLatitude = results[i]._doc.geometry.coordinates[1];
                
                res.write('<li>#'+ i + ' : ' + curName + ', '+ curAddress  + ', ' + curTel + ', ' + curLongitude + ', ' + curLatitude + '</li>');
            }
            res.write('</ul></div>');
            res.end();
        } else{
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>커피숍 리스트 조회 실패</h2>');
            res.end();
        }
    });
};

let findNear = function(req, res){
    console.log('findNear 라우팅 함수 호출됨.');
    let maxDistance = 1000;
    
    let paramLongitude = req.body.longitude || req.query.longitude;
    let paramLatitude = req.body.latitude || req.query.latitude;

    console.log('PARAMS -> ' + paramLongitude + ', ' + paramLatitude);

    let database = req.app.get('database');

    database.CoffeeShopModel.findNear(paramLongitude, paramLatitude, maxDistance, function(err, results){
        if(err){
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>가까운 커피숍 조회 중 에러 발생</h2>');
            res.end();
        }

        if(results){
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>가까운 커피숍 리스트</h2>');
            res.write('<div><ul>');
            for(let i = 0; i<results.length; i++){
                let curName = results[i]._doc.name;
                let curAddress = results[i]._doc.address;
                let curTel = results[i]._doc.tel;
                let curLongitude = results[i]._doc.geometry.coordinates[0];
                let curLatitude = results[i]._doc.geometry.coordinates[1];
                
                res.write('<li>#'+ i + ' : ' + curName + ', '+ curAddress  + ', ' + curTel + ', ' + curLongitude + ', ' + curLatitude + '</li>');
            }
            res.write('</ul></div>');
            res.end();
        } else{
            res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>가까운 커피숍 리스트 조회 실패</h2>');
            res.end();
        }
    });
};

module.exports.add = add;
module.exports.list = list;
module.exports.findNear = findNear;