/* 
 * 首页数据响应路由
 * @Author: Cphayim 
 * @Date: 2017-03-23 16:07:53 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-03-27 11:55:14
 */
const express = require('express');
// 数据库连接模块
const DB = require('../modules/db');
// 服务端错误响应模块
const errRes = require('../modules/resStatus');
// 创建路由
const router = express.Router();

// banner 数据响应
router.get('/banner', (req, res) => {
    dbFindOne(req,res,{module:'banner-slider'});
});

// home-nav 数据响应
router.get('/nav', (req, res) => {
    dbFindOne(req,res,{module:'home-nav'});
});

// 活动 数据响应
router.get('/act', (req, res) => {
    dbFindOne(req,res,{module:'activity'});
});

// 流行货导航 数据响应
router.get('/popular', (req, res) => {
    dbFindOne(req,res,{module:'popular'});
});

// 好货搭配 数据响应
router.get('/collocation',(req,res)=>{
    let index = req.query.index;
    let obj = {
        module:'collocation',
        index
    };
    dbFindOne(req,res,obj);
});

/**
 * @description 到 Home 集合查询一条数据
 * @param {any} req 
 * @param {any} res 
 * @param {any} condition 查询条件对象
 */
function dbFindOne(req, res, condition) {
    DB.Home.findOne(condition, (err, data) => {
        if (!err) {
            res.json({
                status: {
                    code: 1,
                    msg: '请求成功'
                },
                result: data
            });
        } else {
            res.json({
                status: errRes.readErr
            });
        }
    });
}

module.exports = router;