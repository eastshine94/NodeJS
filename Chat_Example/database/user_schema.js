let crypto = require('crypto');

let Schema = {};

Schema.createSchema = function(mongoose){
    console.log('createSchema 호출됨');
    
    let UserSchema= mongoose.Schema({
        email : {type : String, 'default':''},
        hashed_password:{type:String, required:true, 'default':''},
        salt:{type:String, required:true},
        name:{type:String, index:'hashed','default':''},
        created_at: {type:Date, index:{unique:false},'default': Date.now()},
        updated_at: {type:Date, index:{unique:false},'default': Date.now()}
    });
    console.log('UserSchema 정의함');

    UserSchema.path('email').validate(function(email){
        return email.length
    },'email 칼럼의 값이 없습니다.');


    UserSchema
        .virtual('password')
        .set(function(password){
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
            console.log('virtual password 저장됨 : ' + this.hashed_password);
        });

    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
        }
        else{
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });
    //매번 새로운 Salt 값을 갖게 된다.
    UserSchema.method('makeSalt', function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            console.log('authenticate 호출됨.');
            return this.encryptPassword(plainText, inSalt)===hashed_password;
        }
        //DB에 저장된 Salt를 사용
        else{
            console.log('authenticate 호출됨.');
            return this.encryptPassword(plainText)===hashed_password;
        }
    });

    //함수를 등록 -> 모델 객체에서 이 메소드를 사용할 수 있다.
    UserSchema.static('findByEmail', function(email, callback){
        return this.find({email:email},callback);
    });

    UserSchema.static('findAll',function(callback){
        return this.find({},callback);
    });

    return UserSchema;
}


module.exports = Schema;