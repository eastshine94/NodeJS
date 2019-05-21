let person = {};

person.name = '김희동';
person['age'] = 20;

//객체의 속성에 함수를 할당할 수 있다.
person.add  = function(a,b){
    return a + b;
}

console.log('더하기 : ' + person.add(20,20));
