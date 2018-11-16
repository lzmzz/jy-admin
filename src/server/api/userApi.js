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
        return res.json({
            code: '1',
            msg: '操作失败'
        })
    } else {
        return res.json(ret)
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
            if(result1.length<1||result1[0].work_type!=999){
                return res.json({data: '该用户不存在', status: -1})
            }
            if(result1[0].pwd!=params.pwd){
                return res.json({data: '密码错误', status: -1})
            }
            var nowTime = Date.parse(new Date())
            var token = Math.random().toString(36).substr(2)
            conn.query(loginSuccess, [nowTime, token, params.name], function(err, result){
                //存时间戳
                if (err) {
                    return res.json({data: err, status: -1})
                }
                if(result){
                    conn.query(getUserInfo, [token], function(err, result2) {

                        return res.json({data: result2[0], status: 0})
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
                return res.json({data: '该用户不存在', status: -1})
            }
            var nowTime = Date.parse(new Date())/1000
            if(_.isEmpty(result[0].login_time)||(result[0].login_time/1000+21600)<nowTime){
                //登录失效
                conn.query(clearToken, ['', params.token], function(err, result) {

                })
                return res.json({data: '您还未登录，请先登录', status: -1})
            }
            return res.json({data: result[0], status: 0})
        }
    })
})

router.post('/getUserList', (req, res) => {
    var sql = $sql.user.getUserList
    var params = req.body
    var filterArr = []
    var dataArr = []
    checkToken(res, params.token).then(data => {
        if(data){
            if(_.isEmpty(params)||_.isEmpty(params.name)&&_.isEmpty(params.tel)&&(!_.isNumber(params.work_type)||params.work_type==10)){
                conn.query(sql, function(err, result) {
                    if(err){
                        return res.end()
                    }
                    if (result) {
                        return res.json({data: result, status: 0})
                    }
                })
            }else{
                if(!_.isEmpty(params.name)){
                    filterArr.push('name=?')
                    dataArr.push(params.name)
                }if(!_.isEmpty(params.tel)){
                    filterArr.push('tel=?')
                    dataArr.push(params.tel)
                }if(_.isNumber(params.work_type)){
                    filterArr.push('work_type=?')
                    dataArr.push(params.work_type)
                }
                
                if(filterArr.length>0){
                    for(var i=0;i<filterArr.length;i++){
                        sql+=' and '+filterArr[i]
                    }
                }
                conn.query(sql, dataArr, function(err, result) {
                    console.log('result', result)
                    if(err){
                        return res.end()
                    }
                    if (result) {
                        return res.json({data: result, status: 0})
                    }
                })
            }
            
        }
    })
    
})
module.exports = router