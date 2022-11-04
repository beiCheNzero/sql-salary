const express = require('express')
const {
  verifyToken
} = require('../middleware')
const router = express.Router()

const {
  handleRoleInfo,
  handleRoleCount,
  handleNewRole,
  handleDelRole,
  handlePatchRole,
  handleRoleMenuById
  // handleRolePermission
} = require('../controller/role.controller')

// 获取角色信息
router.post('/role/list', verifyToken, handleRoleInfo)

// 获取角色人数
router.post('/role/count', verifyToken, handleRoleCount)

// 新建角色并且分配权限
router.post('/role/register', verifyToken, handleNewRole)

// 删除角色并删除角色菜单
router.delete(`/role/:id`, verifyToken, handleDelRole)

// 修改角色信息
router.patch(`/role/:id`, verifyToken, handlePatchRole)

// 查询角色菜单列表
router.get('/role/:id/menu', verifyToken, handleRoleMenuById)

// 分配角色权限
// router.post('/role/permission', verifyToken, handleRolePermission)

module.exports = router
