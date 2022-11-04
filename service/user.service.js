const connections = require('../app/app.datebase')
const md5 = require('../utils/md5')
const {formatTimeStamp} = require('../utils/data-format')

class userService {
  // 通过id获取用户信息
  async getUserInfoById(emp_id) {
    const statement = `select * from emp where emp_id = ?`
    const userRes = await connections.execute(statement, [emp_id])
    return userRes[0]
  }
  // 根据id删除用户
  async delUserById(emp_id) {
    const statement = `delete from emp where emp_id = ?`
    const userRes = await connections.execute(statement, [emp_id])
    return userRes[0]
  }
  // 修改用户信息
  async patchUserById(payload) {
    const {
      id,
      emp_name,
      emp_sex,
      emp_age,
      emp_post,
      emp_phone,
      dep_id,
      role_id,
    } = payload
    const current_time = new Date()
    const statement = `update emp set emp_name = ?, emp_sex = ?, emp_age = ?, emp_post = ?,
    emp_phone = ?, dep_id = ?, role_id = ?, update_time = ? where emp_id = ?`
    const userRes = await connections.execute(statement, [
      emp_name,
      emp_sex,
      emp_age,
      emp_post,
      emp_phone,
      dep_id,
      role_id,
      current_time,
      id
    ])
    return userRes[0]
  }
  // 查询指定数量的用户信息
  async getAllUserInfo(payload) {
    const {
      emp_id,
      emp_name,
      emp_sex,
      emp_post,
      emp_phone,
      start_time,
      end_time,
      limit,
      offset
    } = payload
    // const statement = `select * from emp where emp_name like \'%${emp_name}%\' limit ? offset ?`
    // const statement2 = `select count(*) as count from (select * from emp where emp_name like \'%${emp_name}%\' limit ? offset ?) as user`

    // 模糊查询用户语句
    const statement3 = `
    SELECT * FROM emp WHERE
      emp_id LIKE ? AND emp_name LIKE ?
      AND emp_sex LIKE ? AND emp_post LIKE ?
      AND emp_phone LIKE ? AND (create_time BETWEEN ? AND ?)
      limit ? offset ?
    `
    // 查询模糊查询之后用户的数量的结果
    // let start_time = ''
    // let end_time = ''
    // if(!(createAt === 'undefined')) {
    //   start_time = createAt[0]
    //   end_time = createAt[1]
    // }
    // const start_time = createAt[0] ?? ''
    // const end_time = createAt[1] ?? ''
    const data = (await connections.execute(statement3, [
      emp_id ? `%${emp_id}%` : '%',
      emp_name ? `%${emp_name}%` : '%',
      emp_sex ? `%${emp_sex}%` : '%',
      emp_post ? `%${emp_post}%` : '%',
      emp_phone ? `%${emp_phone}%` : '%',
      start_time ? `${start_time}` : '1982-01-01 00:00:00',
      end_time ? `${end_time}` : '2030-12-30 00:00:00',
      limit,
      offset
    ]))[0]

    // 模糊查询用户的总数量语句
    const statement4 = `
    select count(*) as count from (
      SELECT * FROM emp WHERE
      emp_id LIKE ? AND emp_name LIKE ?
      AND emp_sex LIKE ? AND emp_post LIKE ?
      AND emp_phone LIKE ? AND (create_time BETWEEN ? AND ?)
    ) as user
    `
    // const data = (await connections.execute(statement, [limit, offset]))[0]
    // 模糊查询用户的总数量语句的结果
    const totalCount = (await connections.execute(statement4, [
      emp_id ? `%${emp_id}%` : '%',
      emp_name ? `%${emp_name}%` : '%',
      emp_sex ? `%${emp_sex}%` : '%',
      emp_post ? `%${emp_post}%` : '%',
      emp_phone ? `%${emp_phone}%` : '%',
      start_time ? `${start_time}` : '1982-01-01 00:00:00',
      end_time ? `${end_time}` : '2030-12-30 00:00:00',
    ]))[0][0].count

    return {
      data,
      totalCount
    }
  }
  // 查询用户权限
  async getUserPower(emp_id) {
    const statement = `select authority from emp where emp_id = ?`
    const dbRes = await connections.execute(statement, [emp_id])
    return dbRes[0][0]
  }
  // 根据id查询部门id
  async getDepIdByUserId(emp_id) {
    const statement = `select dep_id from emp where emp_id = ?`
    const dbRes = await connections.execute(statement, [emp_id])
    return dbRes[0][0]
  }
  // 新建用户
  async getAddUser(payload) {
    const {
      emp_name,
      emp_password,
      emp_sex,
      emp_age,
      emp_post,
      emp_phone,
      dep_id,
      role_id,
      create_time
    } = payload
    const data = new Date()
    const statement = `INSERT INTO emp (emp_name,emp_password,emp_sex,emp_age,emp_post,emp_phone,dep_id,role_id,create_time) VALUE (?,?,?,?,?,?,?,?,?)`
    const dbRes = connections.execute(statement, [
      emp_name ?? '',
      md5(emp_password) ?? '',
      emp_sex ?? '',
      emp_age ?? '',
      emp_post ?? '',
      emp_phone ?? '',
      dep_id ?? '',
      role_id ?? '',
      create_time ?? data
    ])
    return dbRes[0]
  }
}

module.exports = new userService()
