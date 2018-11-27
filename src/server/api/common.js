var common = {}
var mysql = require('mysql')
var models = require('../db')
var conn = mysql.createConnection(models.mysql)
var _ = require('lodash')

common.asyncQuery = function(sql, params){
    //sql语句，params数组
    return new Promise(resolve => {
        conn.query(sql, params, function(err, result) {
            if(result){
                resolve(result)
            }else{
                resolve('err')
            }
        })
    })
}

common.checkToken = function(token){
    return new Promise(resolve => {
        if(_.isEmpty(token)){
            resolve(false)
            return
        }
        conn.query('select work_type from `user` where token=?', [token], function(err, result) {
            if (result[0]&&result[0].work_type==999) {
                resolve(true)
            }else{
                resolve(false)
            }
        })
    })
    
}
module.exports = common