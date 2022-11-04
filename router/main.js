const express = require('express')
const router = express.Router()
// 中间件
const {
  verifyRegister,
  verifyLogin
} = require('../middleware')
// 控制器
const {
  handleRegister,
  handleLogin
} = require('../controller/main.controller')

// 用户注册
router.post('/register', verifyRegister, handleRegister)

// 用户登录
router.post('/login', verifyLogin, handleLogin)

module.exports = router
