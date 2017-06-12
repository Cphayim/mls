/* 
 * @Description: 后端入口文件
 * @Author: Cphayim 
 * @Date: 2017-03-23 09:20:18 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-03-27 14:43:54
 */

const express = require('express');
const app = express();

// 时间格式化模块
require('./modules/dateFormat.js');
//console.log(new Date().Format('yyyy-MM-dd hh:mm:ss'));

// post 请求解析模块
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

// 跨域响应头
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);
    else next();
});

// 路由模块
app.use('/home', require('./router/home-router'));

// 端口监听
const port = 3500;
app.listen(port, () => console.log('mls 服务器已开启, port:' + port));