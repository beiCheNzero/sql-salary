const { TOKEN_SECRETKEY } = require('../app/app.config')
const {
  addUser
} = require('../service/main.service')
const jwt = require('jsonwebtoken')
const md5 = require('../utils/md5')

class mainController {
  // 处理注册的业务逻辑
  async handleRegister(req, res) {
    const {
      emp_id,
      emp_name,
      emp_password,
      emp_sex,
      emp_age,
      emp_post,
      emp_phone,
      emp_insurance,
      dep_id
    } = req.body
    try {
      // 用户注册
      const insertRes = await addUser({
        emp_id,
        emp_name,
        emp_password,
        emp_sex,
        emp_age,
        emp_post,
        emp_phone,
        emp_insurance,
        dep_id
      })
      // console.log(insertRes)

      res.json({
        code: 1,
        msg: '注册成功'
      })
    } catch (error) {
      console.log(error)
      res.status(500).send('注册失败')
      return
    }
  }

  // 处理登录的业务逻辑
  async handleLogin(req, res) {
    console.log('拿到结果后的数据' + req.userInfo)
    const { emp_id } = req.userInfo[0]
    res.json({
      code: 1,
      msg: '登录成功',
      data: {
        // 颁发token
        /*
         * 第一个参数是对象，包含用户的信息
         * 第二个参数是加密密钥(使用uuid的插件生成的)
         * 第三个参数是配置对象：expiresIn是过期时间
        */
        token: jwt.sign({
          emp_id
        }, TOKEN_SECRETKEY, {
          expiresIn: 60*60*24*30
          // 过期时间为一个月
        }),
        userInfo: req.userInfo[0]
      }
    })
  }
}

module.exports = new mainController()
