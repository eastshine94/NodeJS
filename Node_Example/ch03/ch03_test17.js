function add(a,b, callback){
    let result = a+b;
    callback(result);
//외부 함수에 접근했을 때 내부 함수 값이 유지되는 것이 클로저이다.
    let count = 0;
    let history = function(){
        count += 1;
        return count + " : " + a +' + ' + b +  ' = ' + result;
    };
    return history;
}

let add_history = add(20,20, function(result){
    console.log('더하기 결과 : ' +  result);
});

console.log('add_history의 자료형 : ' + typeof(add_history));


//내부 함수의 값인 count값이 증가한다.
console.log('결과값으로 받은 함수 실행 : ' + add_history())
console.log('결과값으로 받은 함수 실행 : ' + add_history())
console.log('결과값으로 받은 함수 실행 : ' + add_history())