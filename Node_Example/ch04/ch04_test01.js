let url = require('url');

let urlStr = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=Popcorn';

let curUrl = url.parse(urlStr);
console.dir(curUrl);

console.log('query -> ' + curUrl.query);

let curStr = url.format(curUrl);
console.log('url -> ' + curStr);

let querystring = require('querystring');
let params = querystring.parse(curUrl.query);
console.dir(params);
console.log('검색어 : ' + params.query);