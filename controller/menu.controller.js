const {
  getAllMenuList,
} = require('../service//menu.service')

class menuController {
  // 获取所有菜单列表
  async handleAllMenuList(req, res) {
    const data = await getAllMenuList()
    try {
      res.status(200).json({
        code: 1,
        msg: "查询菜单列表成功",
        data
      })
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }
}

module.exports = new menuController()
