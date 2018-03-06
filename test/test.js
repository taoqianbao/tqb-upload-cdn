const debug = require('debug')('tqb-upload-cdn[test]')

// 获取基础配置
const configs = require('./config')

const { launcher } = require('../lib')(configs)
var tools = new launcher(configs);

var path = require('path');
var data = [
    './0.gif',
    './img/1.png',
    path.join(__dirname, 'img/2.png'),
    './img/tip.jpg',
    path.join(__dirname, 'img', '3.png'),
    path.join(__dirname, 'img/tip.jpg')
];

data.forEach(function(item) {
    tools.upload({
        files: item
    }).then(function(data) {
        for (var k in data) {
            console.log('上传文件：' + k + ' 成功，cdn地址是：' + data[k]);
        }
    }).catch(function(msg) {
        return console.log('上传失败，原因是：' + msg);
    });
});