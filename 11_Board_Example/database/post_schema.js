let utils = require('../utils/utils');

let SchemaObj = {};

SchemaObj.createSchema = function(mongoose){
    console.log('SchemaObj.createSchema 호출됨');
    let PostSchema = mongoose.Schema({
        title : {
            type:String,
            trim:true,
            'default':''
        },

        contents : {
            type:String,
            trim:true,
            'default':''
        },

        writer : {
            type:mongoose.Schema.ObjectId, 
            ref:'users6'
        },

        tags : {
            type:[], 
            'default':''
        },

        created_at:{
            type:Date,
            index:{unique:false},
            'default':Date.now
        },

        updated_at:{
            type:Date,
            index:{unique:false},
            'default':Date.now
        },

        comments:[{
            contents:{
                type:String,
                trim:true,
                'default':''
            },
            writer : {
                type:mongoose.Schema.ObjectId, 
                ref:'users6'
            },
            created_at:{
                type:Date,
                index:{unique:false},
                'default':Date.now
            }
        }]
    });

    PostSchema.path('title').required(true, '글 제목을 입력하셔야 합니다.');
    PostSchema.path('contents').required(true, '글 내용을 입력하셔야 합니다.');

    PostSchema.methods = {
        //글저장
        savePost : function(callback){
            let self = this;
            this.validate(function(err){
                if(err){
                    return callback(err);
                }
                
                self.save(callback);
            });
        },

        //댓글 추가
        addComment : function(user, comment, callback){
            this.comment.push({
                contents : comment.contents,
                writer : user._id
            });

            this.save(callback);
        },

        removeComment : function(id, callback){
            let index = utils.indexOf(this.comments, {id : id});

            if(~index){
                this.comment.splice(index, 1);
            } else{
                return callback('ID [' + id + ']를 가진 댓글 객체를 찾을 수 없습니다.');
            }

            this.save(callback);
        }
    };

    PostSchema.statics = {
		// ID로 글 찾기
		load: function(id, callback) {
			this.findOne({_id: id})
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		},
		list: function(options, callback) {
			let criteria = options.criteria || {};
			
			this.find(criteria)
				.populate('writer', 'name provider email')
				.sort({'created_at': -1})
				.limit(Number(options.perPage))
				.skip(options.perPage * options.page)
				.exec(callback);
		}
	}

    console.log('PostSchema 정의함');
    return PostSchema;
};


module.exports = SchemaObj;