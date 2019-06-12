let user = require('./user4');

//return 되는 것이 함수이기 때문에 user()로 사용할 수 있다.
function showUser(){
    return user().name + ', ' + 'No group';
}

console.log('사용자 정보 : ' + showUser());