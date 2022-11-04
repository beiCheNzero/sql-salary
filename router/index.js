const express = require('express')
const router = express.Router()

// 导入系统注册登录模块
router.use('', require('./main'))
// 导入用户模块
router.use('', require('./user'))
// 导入工资模块
router.use('', require('./salary'))
// 导入部门管理模块
router.use('', require('./department'))
// 导入菜单模块
router.use('', require('./menu'))
// 导入角色模块
router.use('', require('./role'))

module.exports = router
