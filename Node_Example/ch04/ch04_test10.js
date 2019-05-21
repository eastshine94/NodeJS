let output = '안녕!';
//10바이트를 받는다.
let buffer1 = new Buffer(10);
let len = buffer1.write(output,'utf8')

//한글 3바이트, 다른거 1바이트
console.log('버퍼에 쓰인 문자열의 길이 : ' + len);
console.log('첫번쨰 버퍼에 쓰인 문자열 : '+ buffer1.toString());
console.log('버퍼 객체인지 여부 : ' + Buffer.isBuffer(buffer1));
let bytelen = Buffer.byteLength(buffer1);
console.log('ByteLen : ' + bytelen);

//버퍼의 바이트만큼 출력 0~6바이트;
let str1 = buffer1.toString('utf8',0,6);
console.log("str1 : " + str1);

//버퍼는 한 번 만들어지면 크기를 바꾸기 쉽지 않다. 배열과 비슷
let buffer2 = Buffer.from('Hello','utf8');
console.log('두 번째 버퍼의 길이 : ' + Buffer.byteLength(buffer2));

let str2 = buffer2.toString('utf8',0,Buffer.byteLength(buffer2));
console.log('str2 : ' + str2)