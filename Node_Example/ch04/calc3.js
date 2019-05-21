//이벤트 발생자.
let EventEmitter = require('events').EventEmitter;
let util = require('util');

let Calc = function() {
    this.on('stop', function(count){
        console.log('Calc에 stop 이벤트 전달됨 ' + count)
    });
};

util.inherits(Calc,EventEmitter);

Calc.prototype.add = function(a,b) {
    return a+b;
}

module.exports = Calc;