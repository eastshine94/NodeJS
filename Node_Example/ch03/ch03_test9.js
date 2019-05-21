//배열에 함수를 넣을 수 있다. 함수를 변수에 할당 할 수 있으므로
let users = [{name: '김희동', age : 20}, 
{name:'이민호', age:30}];

let oper = function(a, b){
    return a + b; 
};

users.push(oper);

console.dir(users);
console.log('세번째 배열 요소를 함수로 실행 : ' + users[2](5,5));