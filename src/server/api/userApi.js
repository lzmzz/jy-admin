var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')
var _ = require('lodash')
var common = require('./common')

// 连接数据库
var conn = mysql.createConnection(models.mysql)
conn.multipleStatements = true
conn.connect()
// 登录接口
router.post('/login', (req, res) => {
  var sql = $sql.user.login
  var loginSuccess = $sql.user.loginSuccess
  var getUserInfo = $sql.user.getUserInfo
  var params = req.body
  conn.query(sql, [params.name], function (err, result1) {
    if (err) {}
    if (result1) {
      if (result1.length < 1 || result1[0].work_type != 999) {
        return res.json({
          data: '该用户不存在',
          status: -1
        })
      }
      if (result1[0].pwd != params.pwd) {
        return res.json({
          data: '密码错误',
          status: -1
        })
      }
      var nowTime = Date.parse(new Date())
      var token = Math.random().toString(36).substr(2)
      conn.query(loginSuccess, [nowTime, token, params.name], function (err, result) {
        //存时间戳
        if (err) {
          return res.json({
            data: err,
            status: -1
          })
        }
        if (result) {
          conn.query(getUserInfo, [token], function (err, result2) {

            return res.json({
              data: result2[0],
              status: 0
            })
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
  conn.query(sql, [params.token], function (err, result) {
    if (err) {}
    if (result) {
      if (result.length < 1) {
        return res.json({
          data: '该用户不存在',
          status: -1
        })
      }
      var nowTime = Date.parse(new Date()) / 1000
      if (_.isEmpty(result[0].login_time) || (result[0].login_time / 1000 + 21600) < nowTime) {
        //登录失效
        conn.query(clearToken, ['', params.token], function (err, result) {

        })
        return res.json({
          data: '您还未登录，请先登录',
          status: -1
        })
      }
      return res.json({
        data: result[0],
        status: 0
      })
    }
  })
})

// 增加用户接口
router.post('/addUser', (req, res) => {
  var sql = $sql.user.addUser
  var params = req.body
  conn.query(sql, [params.name, params.tel, params.work_type, params.pwd, params.is_master], function (err, result) {
    if (result) {
      return res.json({
        data: '添加成功',
        status: 0
      })
    } else {
      return res.json({
        data: '添加失败',
        status: -1
      })
    }
  })
})

//用户列表
router.post('/getUserList', (req, res) => {
  var sql = $sql.user.getUserList
  var params = req.body
  var filterArr = []
  var dataArr = []
  if (_.isEmpty(params) || _.isEmpty(params.name) && _.isEmpty(params.tel) && (!_.isNumber(params.work_type) || params.work_type == 10)) {
    conn.query(sql, function (err, result) {
      if (err) {
        return res.end()
      }
      if (result) {
        return res.json({
          data: result,
          status: 0
        })
      }
    })
  } else {
    if (!_.isEmpty(params.name)) {
      filterArr.push('name=?')
      dataArr.push(params.name)
    }
    if (!_.isEmpty(params.tel)) {
      filterArr.push('tel=?')
      dataArr.push(params.tel)
    }
    if (_.isNumber(params.work_type)) {
      filterArr.push('work_type=?')
      dataArr.push(params.work_type)
    }

    if (filterArr.length > 0) {
      for (var i = 0; i < filterArr.length; i++) {
        sql += ' and ' + filterArr[i]
      }
    }
    conn.query(sql, dataArr, function (err, result) {
      console.log('result', result)
      if (err) {
        return res.end()
      }
      if (result) {
        return res.json({
          data: result,
          status: 0
        })
      }
    })
  }
})

//用户详情
router.post('/getUserItem', (req, res) => {
  var sql = $sql.user.getUserItem
  var params = req.body
  async function getRst() {
    var result = await common.asyncQuery(sql, [params.user_id])
    if (result != 'err') {
      return res.json({
        data: result[0],
        status: 0
      })
    } else {
      return res.json({
        data: '修改失败',
        status: -1
      })
    }
  }
  getRst()
})

//修改用户详情
router.post('/setUserItem', (req, res) => {
  var sql = $sql.user.setUserItem
  var params = req.body
  var dataArr = []
  for (var item in params) {
    if (item != 'user_id' && item != 'token') {
      sql += item + '=?, '
      dataArr.push(params[item])
    }
  }
  var str = sql.substring(0, sql.lastIndexOf(', '))
  sql = str + ' '
  sql += 'where id = ?'
  dataArr.push(params.user_id)
  console.log('sql', sql)
  async function getRst() {
    var result = await common.asyncQuery(sql, dataArr)
    if (result != 'err') {
      return res.json({
        data: '修改成功',
        status: 0
      })
    } else {
      return res.json({
        data: '修改失败',
        status: -1
      })
    }
  }
  getRst()
})


//删除员工
router.post('/deleteUser', (req, res) => {
  var sql = $sql.user.deleteUser
  var params = req.body
  async function getRst() {
    var result = await common.asyncQuery(sql, [params.user_id])
    if (result != 'err') {
      return res.json({
        data: '删除成功',
        status: 0
      })
    } else {
      return res.json({
        data: '删除失败',
        status: -1
      })
    }
  }
  getRst()
})
module.exports = router
