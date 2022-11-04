const {
  getDepUserCount,
  getDepInfo,
  patchDepInfo,
  getAddDep,
  delDep
} = require('../service/dep.service')
const {
  getUserPower,
  getDepIdByUserId
} = require('../service/user.service')

class depController {
  // 处理部门信息
  async handleDepInfo(req, res) {
    // 获取部门所信息
    const {
      dep_id,
      dep_name,
      emp_id,
      dep_intr,
      limit,
      offset
    } = req.body
    const data = await getDepInfo({
      dep_id,
      dep_name,
      emp_id,
      dep_intr,
      limit,
      offset
    })
    // 部门人数统计
    const totalCount = await getDepUserCount({
      dep_id,
      dep_name,
      emp_id,
      dep_intr,
      limit,
      offset
    })

    res.json({
      code: 1,
      msg: '部门信息请求成功',
      data,
      totalCount
    })
  }
  // 修改部门信息
  async handlePatchDepInfo(req, res) {
    const { id } = req.params
    if (!id) res.json({
      code: -1,
      msg: '请求应包含部门id'
    })
    const {
      dep_name,
      emp_id,
      dep_intr,
      dep_jb_salary,
      dep_absent_salary,
    } = req.body
    // const userPower = await getUserPower(id)
    // const dep_id = await getDepIdByUserId(id)
    // if(userPower !== '1') res.json({
    //   code: -1,
    //   msg: '权限不够',
    // })
    try {
      const dbRes = (await patchDepInfo({
        id,
        dep_name,
        emp_id,
        dep_intr,
        dep_jb_salary,
        dep_absent_salary,
      }))[0]
      res.json({
        code: 1,
        msg: '修改部门信息成功',
        dbRes
      })
    } catch (error) {
      res.status(500).json({
        code: -1,
        msg: "服务器错误"
      })
    }
  }
  // 新增部门
  async handleAddDep(req, res) {
    const {
      dep_name,
      emp_id,
      dep_intr,
      dep_jb_salary,
      dep_absent_salary,
    } = req.body
    try {
      const data = (await getAddDep({
        dep_name,
        emp_id,
        dep_intr,
        dep_jb_salary,
        dep_absent_salary,
      }))[0]
      res.json({
        code: 1,
        msg: '新建部门成功',
        data
      })
    } catch (error) {
      res.status(500).json({
        code: -1,
        msg: '服务器错误:' + error
      })
    }
  }
  // 删除部门
  async handleDelDep(req, res) {
    const { id } = req.params
    if(!id) res.json({
      code: -1,
      msg: "删除用户应包含部门id"
    })
    const data = await delDep(id)
    res.json({
      code: 1,
      msg: `部门${id}已被删除`
    })
  }
}

module.exports = new depController()
