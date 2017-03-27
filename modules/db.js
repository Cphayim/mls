/* 
 * mongodb 数据库连接，集合创建
 * @Author: Cphayim 
 * @Date: 2017-03-23 09:57:10 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-03-24 10:59:38
 */

// mongoose 模块
const mongoose = require('mongoose');
const DB_URL = 'mongodb://mlsworker:654321@127.0.0.1:37017/mls';

// 连接数据库
mongoose.connect(DB_URL);

// 事件输出
mongoose.connection.on('connected', function() {
    console.log('mls mongodb 数据库连接成功: '+DB_URL.split('@')[1]);
});
mongoose.connection.on('error', function() {
    console.log('mls mongodb 数据库连接失败: '+DB_URL.split('@')[1]);
});
mongoose.connection.on('disconnected', function() {
    console.log('mls mongodb 数据库连接断开: '+DB_URL.split('@')[1]);
});

let Schema = mongoose.Schema;

// home 集合
let homeSchema = new Schema({index:Number,module:String,cover:Array,list:Array,}, { versionKey: false , collection: 'home'});
let Home = mongoose.model('Home',homeSchema);

// product 集合


module.exports = {Home};