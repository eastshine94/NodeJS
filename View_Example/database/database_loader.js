let mongoose = require('mongoose');

let database = {};

database.init =function(app, config){
    console.log('init 호출됨.');
    connect(app, config);
};

function connect(app, config){
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database.db = mongoose.connection;

    database.db.on('open', function(){
        console.log('데이터베이스에 연결됨 : ' + config.db_url);
        createSchema(app, config);
    });
    
    database.db.on('disconnected',function(){
        console.log('데이터베이스 연결 끊어짐');
        
    });

    database.db.on('error',function(){
        console.log('mongoose 연결 에러');
    });
}

function createSchema(app, config){
    console.log('설정의 DB 스키마 수 : ' + config.db_schemas.length);
    for(let i =0; i<config.db_schemas.length; i++){
        let curItem = config.db_schemas[i];
        let curSchema = require(curItem.file).createSchema(mongoose);
        console.log('%s 모듈을 이용해 스키마 생성함.', curItem.file);
        let curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬랙션을 통해 모델 정의함.', curItem.collection);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('스키마 [%s], 모델 [%s] 생성됨.' , curItem.schemaName, curItem.modelName);

    }
    app.set('database', database);
}

module.exports = database;