const express = require('express')
const path = require('path')
const app = express()
// 导入配置文件
const { APP_PORT } = require('./app/app.config')
// 导入数据库配置
require('./app/app.datebase')

// 解析POST请求参数
app.use(express.json()) // 解析json
// app.use(express.urlencoded) // 解析FORM表单格式
app.use(express.static(path.join(__dirname, 'uploads'))) // 处理静态资源

// 注册路由
const router = require('./router/index')
app.use('', router);

app.listen(APP_PORT, () => {
  console.log(`服务器启动成功: http://127.0.0.1:${APP_PORT}`);
})
