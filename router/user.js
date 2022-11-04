const express = require('express')
const {
  verifyToken
} = require('../middleware/index')
const router = express.Router()
const {
  handleUserInfo,
  deleteUser,
  patchUser,
  handleAllUserInfo,
  handleAddUser
} = require('../controller/user.controller')

// 获取用户信息
router.get(`/user/:id`, verifyToken, handleUserInfo)

// 删除用户信息
router.delete(`/user/:id`, verifyToken, deleteUser)

// 修改用户信息
router.patch(`/user/:id`, verifyToken, patchUser)

// 获取所有用户信息
router.post(`/user/list`, verifyToken, handleAllUserInfo)

// 新建用户
router.post('/user/register', verifyToken, handleAddUser)

module.exports = router
