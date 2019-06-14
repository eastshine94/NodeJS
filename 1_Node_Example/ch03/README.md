## ch3 자바스크립트
### 3.1 함수
함수를 정의할 때 두 가지 경우가 있다.
> 더하기 함수를 정의하는 경우 1  
> <pre>function add (a,b){  
>   return a + b;  
> }</pre>

> 더하기 함수를 정의하는 경우 2  
> <pre>let add = function(a,b){  
>   return a + b;  
> };</pre>

두 번째 경우처럼 함수를 변수에 할당하는 과정에서 함수의 이름이 삭제되어 function 키워드 뒤에 곧바로 소괄호가 붙는 형태로 만들어지는데, <b>이것을 익명 함수(Anonymous function)</b>라고 한다. 함수를 익명 함수로 변수에 할당할 때는 함수를 선언하는 <b>선언문(Declaration)</b>이 아니라 일반 수식처럼 <b>표현식(Expression)</b>이 되므로 가장 마지막에 세미콜론(;)을 붙여주는 것이 좋다.

함수가 변수에 할당될 수 있다면 객체 안에 속성으로도 들어갈 수 있다. 즉, 객체의 속성에는 변수를 만들어 할당할 수 있으므로 객체 안의 속성에 함수를 할당할 수 있다.
><pre>let Person = {};
>Person['age'] = 20;
>Person.name = '올라프';
>Person.add = function(a, b){
>        return a + b;
>};
></pre>

><pre>let Person = {
>    age: 20,
>    name: '올라프',
>    add: function(a, b){
>        return a + b;
>    }
>};</pre>


### 3.2 콜백 함수
#### 함수를 호출했을 떄 또 다른 함수를 파라미터로 전달하는 방법
함수를 파라미터로 전달하는 경우는 대부분 <b>비동기 프로그래밍(Non-Blocking Programming)</b> 방식으로 코드를 만들 떄이다. 예를 들어, 더하기 함수를 실행한 후 결과 값이 반환될 때까지 기다리지 않고 그다음 코드를 실행하려면 비동기 방식으로 코드를 만들어야한다. 즉, 더하기 함수를 실행하는 데 시간이 걸릴 수 있기 때문에 그다음 코드를 바로 실행한다. 그러고 나서 연산이 끝났을 때 파라미터로 전달한 함수가 실행 된다면 그 시점에 결과를 처리할 수 있으므로 효율적인 프로그램을 만들 수 있다. 이때 파라미터로 전달되는 함수를 <b>콜백 함수(Callback function)</b>라고 한다. 콜백 함수는 함수가 실행되는 중간에 호출되어 상태 정보를 전달하거나 결과 값을 처리하는 데 사용된다.

<pre>
function add(a, b, callback){
    let result = a + b;
    callback(result); 
}

add(10,10, function(result){
    console.log('더하기 (10,10)의 결과 : %d',  result);
})
</pre>

더하기 연산을 한 결과 값은 파라미터로 전달된 콜백 함수를 호출하면서 그 콜백 함수로 전달한다. 콜백 함수는 미리 변수에 할당해 두었다가 add() 함수를 호출할 때 파라미터로 전달할 수도 있지만, add() 함수를 호출할 떄 익명 함수로 만들어서 파라미터로 바로 전달할 수도 있다.  

#### 함수 안에서 값을 반환할 떄 새로운 함수를 만들어 반환하는 방법
어떤 함수를 실행 했을 떄 또 다른 함수를 반환받으면 반환받은 함수를 그대로 실행할 수 있다. 이렇게 만들면 하나의 함수를 실행했을 때 추가적인 결과를 얻거나 또는 추가 작업을 할 수 있다.

<pre>
function add(a,b, callback){
    let result = a+b;
    callback(result);

    let history = function(){
        return a +' + ' + b +  ' = ' + result;
    };
    return history;
}

let add_history = add(20,20, function(result){
    console.log('더하기 결과 : ' +  result);
});

console.log('add_history의 자료형 : ' + typeof(add_history));
console.log('결과값으로 받은 함수 실행 : ' + add_history());

</pre>

여기에는 add() 함수를 호출했을 떄 콜백 함수를 호출할 뿐만 아니라 함수 객체를 새로 만들어 반환하도록 만들었다. 반환된 함수 객체는 어떤 연산이 수행되었는지 문자열로 알려 주는 함수이다. add() 함수를 실행한 후 반환받은 함수 객체를 add_history 변수에 할당한 후, 그 함수를 실행하였다.

반환된 함수는 보통 처음 실행한 함수 안에서 만들어 지는데 그 아에 있는 변수들은 함수가 반환된 후에도 계속 접근할 수 있다.  
add 함수 안에 history 함수를 몇 번이나 실행했는지 알 수 있도록 count 변수를 만들었다면 이 변수는 add 함수에서 반환된 함수 안에서 계속 접근할 수 있다.  
<pre>
function add(a,b, callback){
    let result = a+b;
    callback(result);

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

console.log('결과값으로 받은 함수 실행 : ' + add_history());
console.log('결과값으로 받은 함수 실행 : ' + add_history());
console.log('결과값으로 받은 함수 실행 : ' + add_history());
</pre>

<pre>
더하기 결과 : 40
결과값으로 받은 함수 실행 : 1 : 20 + 20 = 40
결과값으로 받은 함수 실행 : 2 : 20 + 20 = 40
결과값으로 받은 함수 실행 : 3 : 20 + 20 = 40
</pre>

반환된 함수를 반복해서 실행하면 count 변수의 값이 증가하는 것을 볼 수 있다. 반환된 history 함수가 실행될 때는 이미 add 함수가 메모리에서 접근할 수 없는 상태가 된 다음이다. 따라서 history 함수가 실행될 때는 add 함수 안에 만들어진 count 변수도 같이 접근할 수 없어야 한다. 하지만 이와 같이 함수 안에서 새로운 함수를 만들어 반환하는 경우에는 예외적으로 변수 접근을 허용하는데 이를 <b>클로저(Closure)</b>라고 한다.

### 3.3 프로토타입 객체
<b>객체의 원형(Prototype)</b> 정의한 후 그 원형에서 새로운 인스턴스 객체를 만들어 낼 수 있다.  
프로토타입 객체를 정의하고 나면 new 연산자를 사용하여 인스턴스 객체들을 만들 수 있다.
<pre>
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
console.log('person3의 속도 : ' + person3.speed);
console.log('person4의 속도 : ' + person4.speed);
</pre>

Person 프로토타입 객체를 만들려면 먼저 Person 함수를 정의한다. 자바스크립트에서는 함수도 객체이기 떄문에 이 함수는 객체의 역할을 할 수 있다. 즉, 함수 중에서 new 연산자로 호출되는 함수는 객체를 만들기 위한 함수로 분류되며, 이러한 함수를 <b>생성자(Constructor)</b>라고 한다. 따라서 객체 안에 name 속성에 접근하고 싶다면 this를 사용한다. this는 그 함수를 호출하는 객체를 가리킨다.

다음의 두 코드는 같은 결과를 보여준다.
<pre>
Person.walk = function(){ ... }
Person.prototype.walk = function(){ ... }
</pre>
다만 prototype 속성으로 추가하면 인스턴스 객체를 만들 때 메모리를 효율적으로 관리할 수 있다.