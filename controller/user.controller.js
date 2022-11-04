const {
  getUserInfoById,
  delUserById,
  patchUserById,
  getAllUserInfo,
  getAddUser
} = require('../service/user.service')

class userController {
  // 根据用户id获取信息
  async handleUserInfo(req, res) {
    const { id } = req.params
    if( !id ) res.json({
      code: -1,
      msg: '参数必须包含id'
    })

    const data = await getUserInfoById(id)
    res.json({
      code: 1,
      msg: `请求id为${id}的用户数据成功`,
      data
    })
  }
  // 删除用户信息
  async deleteUser(req, res) {
    const { id } = req.params
    if( !id ) res.json({
      code: -1,
      msg: '删除用户应包含用户id'
    })
    const delRes = await delUserById(id)
    res.json({
      code: 1,
      msg: `用户${id}已被删除`
    })
  }
  // 修改用户信息
  async patchUser(req, res) {
    const { id } = req.params
    if( !id ) res.json({
      code: -1,
      msg: '修改用户应包含用户id'
    })

    const {
      emp_name,
      emp_sex,
      emp_age,
      emp_post,
      emp_phone,
      dep_id,
      role_id,
    } = req.body

    try {
      const userRes = await patchUserById({
        emp_name,
        emp_sex,
        emp_age,
        emp_post,
        emp_phone,
        dep_id,
        role_id,
        id
      })
      const data = await getUserInfoById(id)
      res.json({
        code: 1,
        msg: '修改用户成功',
        data
      })
    } catch (error) {
      res.status(500).json({
        code: -1,
        msg: '修改失败',
        error
      })
    }
  }
  // 获取所有用户信息
  async handleAllUserInfo(req, res) {
    const {
      emp_id,
      emp_name,
      emp_sex,
      emp_post,
      emp_phone,
      createAt,
      limit,
      offset
    } = req.body
    let start_time = ''
    let end_time = ''
    if(typeof createAt !== 'undefined') {
      start_time = createAt[0]
      end_time = createAt[1]
    }
    try {
      const {data, totalCount} = await getAllUserInfo({
        emp_id,
        emp_name,
        emp_sex,
        emp_post,
        emp_phone,
        start_time,
        end_time,
        limit,
        offset
      })
      res.status(200).json({
        code: 1,
        msg: '查询指定数量用户成功',
        data,
        totalCount
      })
    } catch (error) {
      res.status(500).json({
        code: -1,
        msg: '查询用户列表失败',
        error
      })
    }
  }
  // 新建用户
  async handleAddUser(req, res) {
    const {
      emp_name,
      emp_password,
      emp_sex,
      emp_age,
      emp_post,
      emp_phone,
      dep_id,
      role_id
    } = req.body
    try {
      const dataRes = await getAddUser({
        emp_name,
        emp_password,
        emp_sex,
        emp_age,
        emp_post,
        emp_phone,
        dep_id,
        role_id
      })
      res.json({
        code: 1,
        msg: '新建用户成功',
        dataRes
      })
    } catch (err) {
      res.status(500).json({
        code: -1,
        err
      })
    }
  }
}

module.exports = new userController()
