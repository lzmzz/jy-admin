// node 后端服务器
const userApi = require('./api/userApi')
const orderApi = require('./api/orderApi')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

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
app.use(express.static(path.join(__dirname, 'dist')))
// 后端api路由
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'))
})
app.use('/jyadmin/api/user', userApi)
app.use('/jyadmin/api/order', orderApi)
// 监听端口
app.listen(3000)
console.log('success listen at port:3000......')