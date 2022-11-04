const express = require('express')
const {
  verifyToken
} = require('../middleware')
const router = express.Router()
const {
  handleUserSalary,
} = require('../controller/salary.controller')

// 获取用户工资(实发工资)
router.post(`/salary/:id`, verifyToken, handleUserSalary)


module.exports = router
