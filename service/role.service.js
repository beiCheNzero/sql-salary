const connections = require('../app/app.datebase')

class roleService {
  // 获取所有角色信息
  async getRoleInfo(payload) {
    const {
      limit,
      offset,
      role_name,
      role_info,
      state
    } = payload
    const statement = `select * from roles where
    role_name like ? and role_info like ? and state like ? limit ? offset ?`
    const data = (await connections.execute(statement, [
      role_name ? `%${role_name}%` : '%',
      role_info ? `%${role_info}%` : '%',
      state ? `%${state}%` : '%',
      limit,
      offset
    ]))[0]

    const statement4 = `SELECT DISTINCT role_id FROM rolemenus`
    const roleIdList = (await connections.execute(statement4))[0]
    // console.log(roleIdList)

    const statement2 = `SELECT menu_id FROM rolemenus where role_id = ?`
    //! forEach只支持同步代码
    for(const item of roleIdList) {
      const menuList1 = []
      const roleID = item.role_id
      // console.log(roleID);
      const dbRes1 = (await connections.execute(statement2,[roleID]))[0]
      // console.log(dbRes1)
      for(const item of dbRes1) {
        menuList1.push(item.menu_id)
      }
      // 查询三个主菜单
      const statement3 = `select * from menus where menu_id = ? and type = ?`
      const menuList_one = []
      for(const item of menuList1) {
        const dbRes = (await connections.execute(statement3, [item,1]))[0][0]
        if(dbRes) {
          menuList_one.push(dbRes)
        }
      }
      const menuList_two = []
      for(const item of menuList1) {
        const dbRes = (await connections.execute(statement3, [item,2]))[0][0]
        if(dbRes) {
          menuList_two.push(dbRes)
        }
      }
      const menuList_three = []
      for(const item of menuList1) {
        const dbRes = (await connections.execute(statement3, [item,3]))[0][0]
        if(dbRes) {
          menuList_three.push(dbRes)
        }
      }

      // 添加到子菜单
      // 三级 -> 二级
      menuList_two.forEach(item => {
        const menulist = []
        menuList_three.forEach(itemChildren => {
          if(item.menu_id === itemChildren.parent_id) {
            menulist.push(itemChildren)
          }
        })
        item.menulist = menulist ?? 'null'
      })
      // 二级 -> 一级
      menuList_one.forEach(item => {
        const menulist = []
        menuList_two.forEach(itemChildren => {
          if(item.menu_id === itemChildren.parent_id) {
            menulist.push(itemChildren)
          }
        })
        item.menulist = menulist ?? 'null'
      })

      // 添加到最终返回的数据中
      data.forEach(item => {
        if(item.role_id == roleID && !!menuList_one) {
          item.menuList = menuList_one
        }
      })

    }

    return data
  }
  // 统计角色总人数
  async getRoleTotalCount(payload) {
    const {
      role_name,
      role_info,
      state
    } = payload
    const statement2 = `SELECT COUNT(*) AS totalCount FROM (
      select * from roles where
      role_name like ? and role_info like ? and state like ?) AS role`
    const dbRes = (await connections.execute(statement2, [
      role_name ? `%${role_name}%` : '%',
      role_info ? `%${role_info}%` : '%',
      state ? `%${state}%` : '%',
    ]))[0][0].totalCount
    return dbRes
  }
  // 统计角色数量
  async getRoleCount() {
    const statement = `SELECT role_name,COUNT(role_name) AS roleCount FROM roles GROUP BY role_name`
    const dbRes = await connections.execute(statement)
    return dbRes[0]
  }
  // 新建角色
  async getAddRolePermission(payload) {
    const {
      role_name,
      role_info,
      state,
      menuList
    } = payload
    // 创建新角色
    const statement = `insert into roles (role_name, role_info, state) value (?,?,?)`
    const dbRes = await connections.execute(statement, [
      role_name,
      role_info,
      state ?? '禁用'
    ])
    // 获取角色id
    const statement2 = `SELECT role_id FROM roles WHERE role_name = ?`
    const roleID = (await connections.execute(statement2, [role_name ?? '无效人员']))[0][0].role_id
    // 添加权限
    const statement3 = `INSERT INTO rolemenus (role_id, menu_id) VALUE (?,?)`
    for(const item of menuList) {
      await connections.execute(statement3, [roleID, item])
    }
    return roleID
  }
  // 删除角色
  async delRole(role_id) {
    // 删除roles的角色
    const statement = `delete from roles where role_id = ?`
    const dbRes = await connections.execute(statement, [role_id])

    // 删除rolemenus的菜单
    const statement2 = `delete from rolemenus where role_id = ?`
    const dbRes2 = await connections.execute(statement2, [role_id])

    return '删除完成'
  }
  // 修改角色信息和权限
  async patchRoleById(payload) {
    const {
      id,
      role_name,
      role_info,
      state,
      menuList
    } = payload
    const statement = `update roles set role_name = ?, role_info = ?, state = ? where role_id = ?`
    const dbRes = await connections.execute(statement, [
      role_name,
      role_info,
      state,id
    ])
    // 先删除原有的menu_id
    const statement2 = `delete from rolemenus where role_id = ?`
    const dbRes2 = await connections.execute(statement2, [id])

    // 然后将新的menuList存入rolemenus中
    const statement3 = `INSERT INTO rolemenus (role_id, menu_id) VALUE (?,?)`
    for(const item of menuList) {
      await connections.execute(statement3, [id, item])
    }

    return 'ok'
  }
  // 根据用户id查询角色菜单
  async getRoleMenuById(role_id) {
    const statement = `SELECT * FROM menus WHERE menu_id = ANY (SELECT menu_id FROM rolemenus WHERE role_id = ?) and type = 1`
    const userMenuList = await connections.execute(statement, [role_id])
    // 查询角色二级菜单
    const statement1 = `
    SELECT DISTINCT b.menu_id,b.menu_name,b.type,b.url,b.icon,b.parent_id,b.permission
    FROM
    (SELECT * FROM menus WHERE menu_id = ANY (SELECT menu_id FROM rolemenus WHERE role_id = ?)) AS a,
    (SELECT * FROM menus WHERE menu_id = ANY (SELECT menu_id FROM rolemenus WHERE role_id = ?)) AS b
    WHERE a.menu_id = b.parent_id and b.type = 2
    `
    const userMenuListChildren = await connections.execute(statement1,[role_id, role_id])
    // 查询角色三级按钮权限
    const statement2 = `
    SELECT DISTINCT b.menu_id,b.menu_name,b.type,b.url,b.icon,b.parent_id,b.permission
    FROM
    (SELECT * FROM menus WHERE menu_id = ANY (SELECT menu_id FROM rolemenus WHERE role_id = ?)) AS a,
    (SELECT * FROM menus WHERE menu_id = ANY (SELECT menu_id FROM rolemenus WHERE role_id = ?)) AS b
    WHERE a.menu_id = b.parent_id and b.type = 3
    `
    const permission = await connections.execute(statement2, [role_id, role_id])
    userMenuListChildren[0].forEach(item => {
      const children = []
      permission[0].forEach(itemChild => {
        if (item.menu_id === itemChild.parent_id) {
          children.push(itemChild)
        }
      })
      item.children = children
    })

    userMenuList[0].forEach(item => {
      const children = []
      userMenuListChildren[0].forEach(itemChild => {
        if (item.menu_id === itemChild.parent_id) {
          children.push(itemChild)
        }
      })
      item.children = children
    })
    return userMenuList[0]
  }

  // 给角色赋予权限
  // async getRoleAuthority(payload) {
  //   const { role_name,menuList } = payload
  //   // 获取角色id
  //   const statement2 = `SELECT role_id FROM roles WHERE role_name = ?`
  //   const roleID = (await connections.execute(statement2, [role_name ?? '无效人员']))[0][0].role_id
  //   console.log(roleID)
  //   // 添加权限
  //   const statement3 = `insert into rolemenus (role_id, menu_id) value (?,?)`
  //   // menuList.array.forEach(item => {
  //   //   connections.execute(statement3, [roleID, item])
  //   // });
  //   return roleID
  // }
}

module.exports = new roleService()
