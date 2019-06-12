//프로토 타입은 객체 지향 언어의 장점인 여러 객체를 찍어낼 수 있는 붕어빵 틀을 만들기 위해 사용하는 것이다.

let person1 = {name:'소녀시대', age : 20};
let person2 = {name:'걸스데이', age : 21};

function Person(name, age){
    this.name = name;
    this.age = age;
}

Person.prototype.walk = function(speed){
    this.speed = speed;
    console.log(speed + 'km 속도로 걸어갑니다.')
}

let person3 = new Person('소녀시대',20);
let person4 = new Person('걸스데이', 21);

person3.walk(6);
person4.walk(10);
console.log('person3의 속도 : ' + person3.speed)
console.log('person4의 속도 : ' + person4.speed)