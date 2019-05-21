function add(a,b,callback) {
    let result = a+b;
    callback(result);
}


add(10,10, function(result){
    console.log('더하기 결과(콜백함수 안에서) : ' + result);
})
