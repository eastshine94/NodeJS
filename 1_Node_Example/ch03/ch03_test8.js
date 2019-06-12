let names = ['김희동', '이민호'];
let users = [{name: '김희동', age : 20}, 
{name:'이민호', age:30}];

users.push({name: '안준호',age : 25});

console.log('사용자 수 : %d' , users.length);
console.log('첫번째 사용자 이름 : ' + users[0].name);
console.log('첫번째 사용자 나이 : ' + users[0].age);