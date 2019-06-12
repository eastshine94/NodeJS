//log 파일 남기기

let winston = require('winston');

//하나의 파일에 log가 쌓이면 너무 커지므로 매일 다른 파일로 생성하는게 일반적 
let winstonDaily = require('winston-daily-rotate-file');
let moment = require('moment');

function timeStampFormat(){
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ')
}

let logger = new(winston.createLogger)({
    transports: [
        //파일에 저장
        new (winstonDaily)({
            name : 'info-file',
            filename : './log/server',
            dataPattern : "_yyyy-MM-dd.log",
            colorize: false,
            maxsize:50000000,
            maxFiles:1000,
            level:'info',
            showLevel:true,
            json:false,
            timestamp: timeStampFormat,
            format: winston.format.combine(
                winston.format.printf(info=> timeStampFormat() +' - '+info.level+ ": " + info.message)
            )
        }),
        //console 창에 표시
        new(winston.transports.Console)({
            name:'debug-console',
            colorize : true,
            level:'debug',
            showLevel:true,
            json:false,
            timestamp: timeStampFormat,
            format: winston.format.combine(
                winston.format.printf(info=> timeStampFormat() +' - '+info.level+ ": " + info.message)
            )
        })
    ]
});

logger.debug('디버깅 메시지입니다.');
logger.error('에러 메시지입니다.');
console.log(timeStampFormat());