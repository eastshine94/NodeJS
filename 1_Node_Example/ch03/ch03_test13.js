let users = [{name : '김희동', age:20}, 
{name : '이민호', age : 30},{name:'안준호', age: 25}];

//중간에 원소를 삭제했지만, 개수 자체는 변하지 않음
delete users[1];

console.dir(users);

users.forEach(function(elem, index){
    console.log('원소 #' + index);
    console.dir(elem);
});

//중간에 삭제 혹은 추가할 때는 splice를 사용
//첫 번째 값은 index
//두 번째 값이 0이면 추가, 1이상이면 그 값만큼 삭제
users.splice(1,0, {name:'서준현', age:27});
console.dir(users);

users.splice(2,1);
console.dir(users);