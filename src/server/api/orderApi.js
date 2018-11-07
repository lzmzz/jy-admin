var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')
var _ = require('lodash')
// 连接数据库
var conn = mysql.createConnection(models.mysql)

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
function checkToken(res,token){
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
// 订单列表API
router.post('/getOrderList', (req, res) => {
    var sql = $sql.order.getOrderList
    var getOrderCount = $sql.order.getOrderCount
    var filterArr = []
    var dataArr = []
    var params = req.body
    var totalLen = ''
    checkToken(res, params.token).then(data => {
        if(data){
            if(_.isEmpty(params)||(_.isEmpty(params.orderNo)&&_.isEmpty(params.orderFormat)&&_.isEmpty(params.clientName)&&_.isEmpty(params.clientNo)&&!_.isNumber(params.startTime))){
                //无筛选
                conn.query(getOrderCount, function(err, result) {
                    if (result) {
                        totalLen = result[0]['count(*)']
                    }
                })
                sql+='limit '+(params.page-1)*10+','+10
                conn.query(sql, function(err, result) {
                    if (err) {
                        console.log(err)
                    }
                    if (result) {
                        res.json({data: result.reverse(),status: 0, totalLen: totalLen})
                    }
                })
                return
            }if(!_.isEmpty(params.orderNo)){
                filterArr.push('order_no=?')
                dataArr.push(params.orderNo)
            }if(!_.isEmpty(params.orderFormat)){
                filterArr.push('order_format=?')
                dataArr.push(params.orderFormat)
            }if(!_.isEmpty(params.clientName)){
                filterArr.push('client_name=?')
                dataArr.push(params.clientName)
            }if(!_.isEmpty(params.clientNo)){
                filterArr.push('client_no=?')
                dataArr.push(params.clientNo)
            }if(_.isNumber(params.startTime)){
                filterArr.push('create_time<=?')
                filterArr.push('create_time>=?')
                dataArr.push(params.startTime)
                dataArr.push(params.endTime)
            }
            if(filterArr.length>0){
                for(var i=0;i<filterArr.length;i++){
                    if(i==0){
                        sql+=' where '+filterArr[0]
                        getOrderCount+=' where '+filterArr[0]
                    }else{
                        sql+=' and '+filterArr[i]
                        getOrderCount+=' and '+filterArr[i]
                    }
                }
            }
            conn.query(getOrderCount, dataArr, function(err, result) {
                if (result) {
                    totalLen = result[0]['count(*)']
                }
            })
            sql+=' limit '+(params.page-1)*10+','+10
            console.log(sql,'test')
            conn.query(sql, dataArr, function(err, result) {
                if (result) {
                    res.json({data: result.reverse(), status: 0, totalLen: totalLen})
                }else{
                    res.json({data: '系统错误',status: -1})
                }
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
    checkToken(res, params.token).then(data => {
        if(data){
            conn.query(getOrderItem, [params.order_no], function(err, result) {
                if (err) {
                    console.log(err)
                }
                if (result.length>0) {
                    res.json({data: '订单号已存在！', status: -1})
                }else{
                    conn.query(sql, [params.order_no,params.create_time,params.order_status,params.order_name,params.order_many,params.client_name,params.order_format,params.client_no,params.client_request,params.order_remark,params.order_type], function(err, result) {
                        if (err) {
                            console.log(err)
                        }
                        if (result) {
                            res.json({data: '新增订单成功', status: 0})
                        }else{
                            res.json({data: '系统错误',status: -1})
                        }
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
    checkToken(res, params.token).then(data => {
        if(data){
            conn.query(sql, [params.orderNo], function(err, result) {
                console.log('aaaaaaaa')
                if (err) {
                    console.log(err)
                }
                if (result) {
                    res.json({data: result[0],status: 0})
                }else{
                    res.json({data: '系统错误',status: -1})
                }
            })
        }
    })
})
// 修改订单API
router.post('/setOrderItem', (req, res) => {
    var sql = $sql.order.setOrderItem
    var params = req.body
    checkToken(res, params.token).then(data => {
        if(data){
            var dataArr = []
            for(var item in params){
                if(item!='order_no'&&item!='token'){
                    sql+=item+'=?, '
                    dataArr.push(params[item])
                }
            }
            var str = sql.substring(0,sql.lastIndexOf(', '))
            sql = str+' '
            if(_.isEmpty(params.order_no)){
                res.json({data: '订单号为空！',status: -1})
                return
            }
            sql+='where order_no = ?'
            dataArr.push(params.order_no)
            console.log(sql,'sql')
            conn.query(sql, dataArr, function(err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    res.json({data: '订单修改成功',status: 0})
                }else{
                    res.json({data: '系统错误',status: -1})
                }
            })
        }
    })
})
// 获取订单数量详情API
router.post('/getStatusDtl', (req, res) => {
    var sql = $sql.order.getStatusDtl
    var params = req.body
    checkToken(res, params.token).then(data => {
        if(data){
            conn.query(sql, [params.order_no], function(err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    console.log(result, 'result.data')
                    res.json({data: result,status: 0})
                }else{
                    res.json({data: '系统错误',status: -1})
                }
            })
        }
    })
})
// 删除订单API
router.post('/deleteOrder', (req, res) => {
    var sql = $sql.order.deleteOrder
    var sql2= $sql.order.deleteOrderDtl
    var params = req.body
    checkToken(res, params.token).then(data => {
        if(data){
            conn.query(sql, [params.order_no], function(err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    conn.query(sql2, [params.order_no], function(err, result2) {
                        if(result2){
                            res.json({data: '删除成功',status: 0})                            
                        }else{
                            res.json({data: '系统错误',status: -1})
                        }
                    })
                }else{
                    res.json({data: '系统错误',status: -1})
                }
            })
        }
    })
})
module.exports = router