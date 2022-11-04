const {
  getUserByUsername
} = require('../service/main.service')
const md5 = require('../utils/md5')
const jwt = require('jsonwebtoken')
const { TOKEN_SECRETKEY } = require('../app/app.config')

// 验证注册的逻辑
const verifyRegister = async (req, res, next) => {
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
  // console.log(req.body)
  // console.log(Object.keys(req.body).length);
  if( Object.keys(req.body).length < 5 || !emp_id || !emp_name ||!emp_password || !emp_post || !dep_id ) {
    res.status(401).json({
      code: -1,
      msg: '所有信息需要填完整'
    })
    return
  }

  // 使用连接池
  try {
    // 拆线呢用户是否存在
    const dbRes = await getUserByUsername(req.body.emp_name)
    if(dbRes.length !== 0){
      res.status(500).json({
        code: -1,
        msg: '该用户已注册'
      })
      return
    }
  }catch (error) {
    res.status(500).json({
      code: -1111111,
      msg: '服务器出问题了',
      error: error
    })
    return
  }
  next()
}

// 验证登录的逻辑
const verifyLogin = async (req, res, next) => {
  const { emp_name, emp_password } = req.body
  // 用户名和密码是否为空
  if ( !emp_name || !emp_password ) {
    res.status(401).json({
      code: -1,
      msg: '用户名和密码不能为空'
    })
    return
  }

  const dbRes = await getUserByUsername(emp_name)
  // 根据用户名查询信息是否存在
  if (dbRes.length === 0) {
    res.status(401).json({
      code: -1,
      msg: '用户名未注册, 请先注册后登录',
    })
    return
  }
  // 输入的密码和用户的密码是否匹配
  if (md5(emp_password) !== dbRes[0].emp_password) {
    res.status(401).json({
      code: -1,
      msg: '用户名和密码不正确'
    })
    return
  }
  // 将用户信息绑定后发出
  req.userInfo = dbRes
  next()
}

// 用户登录验证token
const verifyToken = async (req, res, next) => {
  const {
    authorization
  } = req.headers
  if (!authorization) {
    res.status(401).send({
      code: -1,
      msg: '无效token'
    })
    return
  }
  const token = authorization.replace('Bearer ', '')
  try {
    // 解析token
    const dedcoded = jwt.verify(token, TOKEN_SECRETKEY)
    // 传递用户信息
    req.userInfo = dedcoded
    next()
  } catch (error) {
    res.status(403).send({
      code: -1,
      msg: 'token校验未通过'
    })
    return
  }
}

module.exports = {
  verifyRegister,
  verifyLogin,
  verifyToken
}
