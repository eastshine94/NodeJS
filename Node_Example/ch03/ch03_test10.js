let users = [{name : '김희동', age : 20},
{name : '이민호', age : 21},{name : '안준호', age : 30}];


let i
for(i=0; i<users.length; i++){
    console.log('배열 원소 #'+ i + ' : ' + users[i].name);
}

users.forEach(function(elem, index){
    console.log('배열 원소 #' + index + ' : ' + elem.name);
});
