const express = require('express')
const { verifyToken } = require('../middleware/index')
const router = express.Router()
const {
  handleAllMenuList,
} = require('../controller/menu.controller')

// 获取菜单列表信息
router.post('/menu/list', verifyToken, handleAllMenuList)

module.exports = router
