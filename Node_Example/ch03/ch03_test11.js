let users = [{name : '김희동', age:20}, {name : '이민호', age : 30}];
console.log('배열 원소의 갯수 : ' + users.length);
users.push({name:'안준호', age:26});
console.log('배열원소의 개수 : ' + users.length);

let elem  = users.pop();
console.log('배열 원소의 개수 : ' + users.length);

console.log('pop으로 꺼낸 세번째 원소');
console.dir(elem)