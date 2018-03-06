# tqb-upload-cdn - 将图片发送至图床的组件

一个发送图片上图床的组件，能够接受一个本地文件地址或者线上地址，在文件上传成功后本地会留下缓存

```sh
npm install --save tqb-upload-cdn
```

## A Simple Example

引用配置文件
```js
const CONF = {
	uploadUrl: 'http://wwww.uploader.com/api',
    host: 'crossDomain.com',
    max: 6,
    prefix: 'img'
}
module.exports = CONF
```


可以直接这样调用
```js
// 获取基础配置
const configs = require('./config')
const {launcher} = require('tqb-upload-cdn').default(configs);
var uploader = new launcher(configs);

var path = require('path');

var data = [
	'./0.gif',
	'./img/1.png',
	path.join(__dirname, 'img/2.png'),
	'./img/tip.jpg',
	path.join(__dirname, 'img', '3.png'),
	path.join(__dirname, 'img/tip.jpg')
];

var uploader = new uploader();

data.forEach(function (item) {
	uploader.upload({
		files: item
	}).then(function (data) {
		for (var k in data) {
			console.log('上传文件：' + k + ' 成功，cdn地址是：' + data[k]);
		}
	}).catch(function (msg) {
		return console.log('上传失败，原因是：' + msg);
	});
});
```

## ES6
```js
import uploader from 'tqb-upload-cdn';
import path from 'path';

const data = [
	'./0.gif',
	'./img/1.png',
	path.join(__dirname, 'img/2.png'),
	'./img/tip.jpg',
	path.join(__dirname, 'img', '3.png'),
	path.join(__dirname, 'img/tip.jpg')
];

const uploader = new uploader();

data.forEach(function (item) {
	uploader.upload({
		files: item
	}).then(function (data) {
		for (var k in data) {
			console.log('上传文件：' + k + ' 成功，cdn地址是：' + data[k]);
		}
	}).catch(function (msg) {
		return console.log('上传失败，原因是：' + msg);
	});
});
```


