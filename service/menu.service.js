const connections = require('../app/app.datebase')

class menuService {
  // 查询所有菜单
  async getAllMenuList() {
    // 查询一级菜单
    const statement = `select * from menus where type = 1`
    const menuList = await connections.execute(statement)
    // 查询二级菜单
    const statement1 = `SELECT DISTINCT b.menu_id,b.menu_name,b.type,b.url,b.icon,b.parent_id,b.permission FROM menus a, menus b WHERE a.menu_id = b.parent_id AND b.type = 2`
    const menuListChildren = await connections.execute(statement1)
    // 查询三级菜单(按钮权限)
    const statement2 = `SELECT DISTINCT b.menu_id,b.menu_name,b.type,b.url,b.icon,b.parent_id,b.permission FROM menus a, menus b WHERE a.menu_id = b.parent_id AND b.type = 3`
    const permission = await connections.execute(statement2)

    menuListChildren[0].forEach(item => {
      const children = []
      permission[0].forEach(itemChild => {
        if (item.menu_id === itemChild.parent_id) {
          children.push(itemChild)
        }
      })
      item.children = children
    })
    menuList[0].forEach(item => {
      const children = []
      menuListChildren[0].forEach(itemChild => {
        if (item.menu_id === itemChild.parent_id) {
          children.push(itemChild)
        }
      })
      item.children = children
    })

    return menuList[0]
  }

  // 修改用户权限
}

module.exports = new menuService()
