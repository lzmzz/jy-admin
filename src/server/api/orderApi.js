var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')
var _ = require('lodash')
var common = require('./common')
// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()
// 订单列表API
router.post('/getOrderList', (req, res) => {
  var sql = $sql.order.getOrderList
  var getOrderCount = $sql.order.getOrderCount
  var filterArr = []
  var dataArr = []
  var params = req.body
  var totalLen = ''
  if (_.isEmpty(params) || (_.isEmpty(params.orderNo) && _.isEmpty(params.orderFormat) && _.isEmpty(params.clientName) && _.isEmpty(params.clientNo) && !_.isNumber(params.startTime))) {
    //无筛选
    conn.query(getOrderCount, function (err, result) {
      if (result) {
        totalLen = result[0]['count(*)']
      }
    })
    sql += 'limit ' + (params.page - 1) * 10 + ',' + 10
    conn.query(sql, function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        return res.json({
          data: result.reverse(),
          status: 0,
          totalLen: totalLen
        })
      }
    })
    return
  }
  if (!_.isEmpty(params.orderNo)) {
    filterArr.push('order_no=?')
    dataArr.push(params.orderNo)
  }
  if (!_.isEmpty(params.orderFormat)) {
    filterArr.push('order_format=?')
    dataArr.push(params.orderFormat)
  }
  if (!_.isEmpty(params.clientName)) {
    filterArr.push('client_name=?')
    dataArr.push(params.clientName)
  }
  if (!_.isEmpty(params.clientNo)) {
    filterArr.push('client_no=?')
    dataArr.push(params.clientNo)
  }
  if (_.isNumber(params.startTime)) {
    filterArr.push('create_time<=?')
    filterArr.push('create_time>=?')
    dataArr.push(params.startTime)
    dataArr.push(params.endTime)
  }
  if (filterArr.length > 0) {
    for (var i = 0; i < filterArr.length; i++) {
      if (i == 0) {
        sql += ' where ' + filterArr[0]
        getOrderCount += ' where ' + filterArr[0]
      } else {
        sql += ' and ' + filterArr[i]
        getOrderCount += ' and ' + filterArr[i]
      }
    }
  }
  conn.query(getOrderCount, dataArr, function (err, result) {
    if (result) {
      totalLen = result[0]['count(*)']
    }
  })
  sql += ' limit ' + (params.page - 1) * 10 + ',' + 10
  console.log(sql, 'test')
  conn.query(sql, dataArr, function (err, result) {
    if (result) {
      return res.json({
        data: result.reverse(),
        status: 0,
        totalLen: totalLen
      })
    } else {
      return res.json({
        data: '系统错误',
        status: -1
      })
    }
  })

})

// 新增订单API
router.post('/addOrder', (req, res) => {
  var sql = $sql.order.addOrder
  var getOrderItem = $sql.order.getOrderItem
  var params = req.body
  params.create_time = new Date(new Date().toLocaleDateString()).getTime()
  params.order_status = 0
  conn.query(getOrderItem, [params.order_no], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result.length > 0) {
      return res.json({
        data: '订单号已存在！',
        status: -1
      })
    } else {
      conn.query(sql, [params.order_no, params.create_time, params.order_status, params.order_name, params.order_many, params.client_name, params.order_format, params.client_no, params.client_request, params.order_remark, params.order_type, params.price, params.pg_price], function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result) {
          return res.json({
            data: '新增订单成功',
            status: 0
          })
        } else {
          return res.json({
            data: '系统错误',
            status: -1
          })
        }
      })
    }
  })

})

// 订单详情API
router.post('/getOrderItem', (req, res) => {
  var sql = $sql.order.getOrderItem
  var params = req.body
  console.log(params)
  conn.query(sql, [params.orderNo], function (err, result) {
    console.log('aaaaaaaa')
    if (err) {
      console.log(err)
    }
    if (result) {
      return res.json({
        data: result[0],
        status: 0
      })
    } else {
      return res.json({
        data: '系统错误',
        status: -1
      })
    }
  })
})
// 修改订单API
router.post('/setOrderItem', (req, res) => {
  var sql = $sql.order.setOrderItem
  var params = req.body
  var dataArr = []
  for (var item in params) {
    if (item != 'order_no' && item != 'token') {
      sql += item + '=?, '
      dataArr.push(params[item])
    }
  }
  var str = sql.substring(0, sql.lastIndexOf(', '))
  sql = str + ' '
  if (_.isEmpty(params.order_no)) {
    return res.json({
      data: '订单号为空！',
      status: -1
    })
  }
  sql += 'where order_no = ?'
  dataArr.push(params.order_no)
  console.log(sql, 'sql')
  conn.query(sql, dataArr, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      return res.json({
        data: '订单修改成功',
        status: 0
      })
    } else {
      return res.json({
        data: '系统错误',
        status: -1
      })
    }
  })
})
// 获取订单数量详情API
router.post('/getStatusDtl', (req, res) => {
  var sql = $sql.order.getStatusDtl
  var params = req.body
  conn.query(sql, [params.order_no], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result, 'result.data')
      return res.json({
        data: result,
        status: 0
      })
    } else {
      return res.json({
        data: '系统错误',
        status: -1
      })
    }
  })
})
// 删除订单API
router.post('/deleteOrder', (req, res) => {
  var sql = $sql.order.deleteOrder
  var sql2 = $sql.order.deleteOrderDtl
  var params = req.body
  conn.query(sql, [params.order_no], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      conn.query(sql2, [params.order_no], function (err, result2) {
        if (result2) {
          return res.json({
            data: '删除成功',
            status: 0
          })
        } else {
          return res.json({
            data: '系统错误',
            status: -1
          })
        }
      })
    } else {
      return res.json({
        data: '系统错误',
        status: -1
      })
    }
  })
})

//获取员工工资
router.post('/getWageDtl', (req, res) => {
  var sql = $sql.order.getWageDtl
  var sql2 = $sql.order.getWageDtl2
  var params = req.body
  var date = new Date()
  date.setDate(1)
  params.startDay = new Date(date.toLocaleDateString()).getTime()
  async function getRst() {
    var result = await common.asyncQuery(sql, [params.user_id, params.startDay])
    if (result != 'err') {
      var lsArr = []
      for (var i = 0; i < result.length; i++) {
        var obj = result[i]
        var result2 = await common.asyncQuery(sql2, [result[i].order_no])
        if (result2 != 'err') {
          obj.price = result2[0].price
          obj.pg_price = result2[0].pg_price
          if (params.work_type == 6) {
            //抛光小计
            obj.xiaoji = result2[0].pg_price * obj.status_many
          } else {
            obj.xiaoji = result2[0].price * obj.status_many
          }
          lsArr.push(obj)
        } else {
          res.json({
            data: [],
            status: 0
          })
          return
        }
      }
      res.json({
        data: lsArr,
        status: 0
      })
    } else {
      res.json({
        data: [],
        status: 0
      })
    }

  }
  getRst()
})

//修改员工生产数量
router.post('/setStatusMany', (req, res) => {
  var sql = $sql.order.setStatusMany
  var params = req.body
  async function getRst() {
    for (var i in params.statusTableData) {
      var data = params.statusTableData[i]
      var result = await common.asyncQuery(sql, [data.statusMany, data.order_no, data.user_id])
      if (result == 'err') {
        return res.json({
          data: '修改失败',
          status: -1
        })
      } else {
        continue
      }
    }
    return res.json({
      data: '修改成功',
      status: 0
    })
  }
  getRst()
})
module.exports = router
