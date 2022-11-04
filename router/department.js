const express = require('express')
const {
  verifyToken
} = require('../middleware')
const router = express.Router()
const {
  handleDepInfo,
  handlePatchDepInfo,
  handleAddDep,
  handleDelDep
} = require('../controller/dep.controller')

// 获取部门信息
router.post('/dep/list', verifyToken, handleDepInfo)

// 修改部门信息
router.patch('/dep/:id', verifyToken, handlePatchDepInfo)

// 新建部门
router.post(`/dep/register`, verifyToken, handleAddDep)

// 删除部门
router.delete(`/dep/:id`, verifyToken, handleDelDep)

module.exports = router
