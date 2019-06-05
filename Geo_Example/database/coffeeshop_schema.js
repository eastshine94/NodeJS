let Schema = {};

Schema.createSchema = function(mongoose){
    let coffeeShopSchema = mongoose.Schema({
        name: {type:String, index:'hashed', default:''},
        address: {type:String, default:''},
        tel:{type:String, default:''},
        geometry: {
            type: {type:String, default:'Point'},
            coordinates: [{type:'Number'}]
        },
        created_at: {type:Date, index:{unique:false}, default:Date.now},
        updated_at: {type:Date, index:{unique:false}, default:Date.now}
    });
    
    coffeeShopSchema.index({geometry:'2dsphere'});
    coffeeShopSchema.static('findAll', function(callback){
        return this.find({}, callback);
    });
    
    //findNear를 입력하여 함수 호출
    //limit를 1로 하면 검색된 1개의 데이터만 보여줌
    
    coffeeShopSchema.static('findNear', function(longitude, latitude, maxDistance, callback){
        console.log('findNear 호출됨.');
        //geometry에 near이라는 함수가 미리 정의되어 있기 때문에 가져다 쓰면 된다.
        this.find().where('geometry').near({
            center: {type:'Point', coordinates:[parseFloat(longitude), parseFloat(latitude)]},
            maxDistance:maxDistance
        }).limit(1).exec(callback);
    });
    return coffeeShopSchema;
};

module.exports = Schema;