let Calc = require('./calc3');

let calc1 = new Calc();
calc1.emit('stop',10);
console.log('더하기 : ' + calc1.add(10,10));
console.log('Calc에 stop 이벤트 전달함');