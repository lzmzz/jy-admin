// node 后端服务器
const userApi = require('./api/userApi')
const orderApi = require('./api/orderApi')
const fs = require('fs')
const path = require('path')
//bodyParser 第三方中间件 用于获取http的req数据
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const common = require('./api/common')
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "*");
    // res.header("Access-Control-Allow-Methods","POST,GET");
    // res.header("X-Powered-By",' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// app.get('/', function (req, res) {
//   res.sendFile('./views/index.html')
// })
app.use(express.static(path.join(__dirname, 'dist')))//静态文件目录
// 后端api路由
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'))
})
app.use('/jyadmin/api/', function(req, res, next){
  if(req.body.token){
    //传了token表示要验证
    common.checkToken(req.body.token).then(res=>{
      if(!res){
        res.json({data: '登录失效', status: -1})    
        return false
      }else{
        next()
      }
    })
  }else{
    next()
  }
})

app.use('/jyadmin/api/user', userApi)
app.use('/jyadmin/api/order', orderApi)
// 监听端口
app.listen(3000)
console.log('success listen at port:3000......')