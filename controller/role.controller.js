const {
  getRoleInfo,
  getRoleTotalCount,
  getRoleCount,
  getAddRolePermission,
  delRole,
  patchRoleById,
  getRoleMenuById
  // getRoleAuthority
} = require('../service/role.service')

class roleController {
  // 查询所有角色信息
  async handleRoleInfo(req, res) {
    const {
      limit,
      offset,
      role_id,
      role_name,
      role_info,
      state
    } = req.body
    const data = await getRoleInfo({
      limit,
      offset,
      role_id,
      role_name,
      role_info,
      state
    })
    const totalCount = await getRoleTotalCount(
      {
        role_name,
        role_info,
        state
      }
    )
    try {
      res.json({
        code: 1,
        msg: '查询所有角色成功',
        data,
        totalCount
      })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  }
  // 查询角色人数
  async handleRoleCount(req, res) {
    const data = await getRoleCount()
    res.json({
      code: 1,
      msg: '查询角色人数成功',
      data
    })
  }
  // 新建角色
  async handleNewRole(req, res) {
    const {
      role_name,
      role_info,
      state,
      menuList
    } = req.body
    const dbRes = await getAddRolePermission({
      role_name,role_info,state,menuList
    })
    res.json({
      code: 1,
      msg: "创建角色成功且分配权限成功",
      data: dbRes
    })
  }
  // 分配权限
  async handleRolePermission(req,res) {
    const {
      role_name,
      menuList
    } = req.body
    const dbRes = await getRoleAuthority({
      role_name, menuList:menuList
    })
    res.json({
      code: 1,
      msg: "创建角色成功",
      data: dbRes
    })
  }
  // 删除角色
  async handleDelRole(req, res) {
    const { id } = req.params
    if( !id ) res.json({
      code: -1,
      msg: '删除角色应包含用户id'
    })
    const data = await delRole(id)
    res.json({
      code: 1,
      msg: '删除角色成功'
    })
  }
  // 修改角色
  async handlePatchRole(req, res) {
    const { id } = req.params
    if(!id) res.json({
      code: -1,
      msg: "缺少角色id"
    })

    const {
      state,
      role_name,
      role_info,
      menuList
    } = req.body

    try {
      const roleRes = await patchRoleById({
        id,
        role_name,
        role_info,
        state,
        menuList
      })
      res.json({
        code: 1,
        msg: "修改角色信息成功"
      })

    } catch (err) {
      res.status(500).json({
        code: -1,
        msg: '服务器错误，修改失败'
      })
    }

  }
  // 根据角色id获取菜单列表
  async handleRoleMenuById(req, res) {
    const { id } = req.params
    const data = await getRoleMenuById(id)
    try {
      res.status(200).json({
        code: 1,
        msg: "查询角色菜单列表成功",
        data
      })
    } catch (error) {
      console.log(error);
      res.json(error)
    }
  }
}

module.exports = new roleController()
