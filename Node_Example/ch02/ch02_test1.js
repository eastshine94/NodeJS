console.log("hello world");
console.log('숫자입니다. %d', 10);
console.log('문자열입니다. %s','안녕');

let person = {
    name:'김희동',
    age:20
};
console.log("JSON객체입니다. %j", person.name);
console.dir(person);

console.time('duration_time');
let result = 0;
for(let i=0; i<10000; i++){
    result += i;
}
console.timeEnd('duration_time');

console.log('파일이름 : %s', __filename);
console.log('경로 : %s', __dirname);