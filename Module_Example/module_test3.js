//user3.js 안에 user 객체가 그대로 return
let user = require('./user3');

function showUser(){
    return user.getUser().name + ', ' + user.group.name;
}

console.log('사용자 정보 -> ' + showUser());