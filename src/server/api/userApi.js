var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')
var _ = require('lodash')
// 连接数据库
var conn = mysql.createConnection(models.mysql)
conn.multipleStatements=true
conn.connect()
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        })
    } else {
        res.json(ret)
    }
}
var checkToken = function(res,token){
    var sql = $sql.user.checkToken
    return new Promise(resolve => {
        if(_.isEmpty(token)){
            res.json({data: '登录失效', status: -1})
            resolve(false)
            return
        }
        conn.query(sql, [token], function(err, result) {
            if (result[0]&&result[0].work_type==999) {
                resolve(true)
            }else{
                res.json({data: '登录失效', status: -1})
                resolve(false)
            }
        })
    })
}
// 登录接口
router.post('/login', (req, res) => {
    var sql = $sql.user.login
    var loginSuccess = $sql.user.loginSuccess
    var getUserInfo = $sql.user.getUserInfo
    var params = req.body
    conn.query(sql, [params.name], function(err, result1) {
        if (err) {
        }
        if (result1) {
            console.log('12311111111111', '')
            if(result1.length<1||result1[0].work_type!=999){
                res.json({data: '该用户不存在', status: -1})            
                return
            }
            if(result1[0].pwd!=params.pwd){
                res.json({data: '密码错误', status: -1})
                return
            }
            var nowTime = Date.parse(new Date())
            var token = Math.random().toString(36).substr(2)
            conn.query(loginSuccess, [nowTime, token, params.name], function(err, result){
                //存时间戳
                if (err) {
                    res.json({data: err, status: -1})
                }
                if(result){
                    conn.query(getUserInfo, [token], function(err, result2) {

                        res.json({data: result2[0], status: 0})
                    })
                }
            })
        }
    })
})

// 获取用户信息接口
router.post('/getUserInfo', (req, res) => {
    var sql = $sql.user.getUserInfo
    var clearToken = $sql.user.clearToken
    var params = req.body
    checkToken(res, params.token)
    conn.query(sql, [params.token], function(err, result) {
        if (err) {
        }
        if (result) {
            if(result.length<1){
                res.json({data: '该用户不存在', status: -1})
                return
            }
            var nowTime = Date.parse(new Date())/1000
            if(_.isEmpty(result[0].login_time)||(result[0].login_time/1000+21600)<nowTime){
                //登录失效
                conn.query(clearToken, ['', params.token], function(err, result) {

                })
                res.json({data: '您还未登录，请先登录', status: -1})
                return
            }
            res.json({data: result[0], status: 0})
        }
    })
})

// 增加用户接口aaa
router.post('/addUser', (req, res) => {
    var sql = $sql.user.addUser
    var params = req.body
    checkToken(res, params.token)
    conn.query('select * from `user` where user_name=?', [params.name], function(err, result) {
        if (err) {
        }
        if (result) {
            res.json({data: '该用户已存在', status: -1})
            return
        }
    })
    conn.query(sql, [params.name, params.tel, params.work_type, params.pwd, params.is_master], function(err, result) {
        if (err) {
        }
        if (result) {
            res.json({data: '添加成功', status: 0})
        }
    })
})

module.exports = router