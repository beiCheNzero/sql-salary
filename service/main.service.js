const connections = require('../app/app.datebase')
const md5 = require('../utils/md5')

class mainService {
  // 通过用户名查询此用户是否存在
  async getUserByUsername(emp_name) {
    const statement = `select * from emp where emp_name = ?`
    // 防止sql注入
    const dbRes = await connections.execute(statement, [emp_name])
    return dbRes[0]
  }

  // 插入User数据
  async addUser(payload) {
    // console.log(payload);
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
    } = payload

    const statement = `insert into emp (emp_id,emp_name,emp_password,emp_sex,emp_age,emp_post,emp_phone,emp_insurance,dep_id) values (?,?,?,?,?,?,?,?,?)`
    const insertRes = await connections.execute(statement, [
      emp_id ?? '',
      emp_name ?? '',
      md5(emp_password),
      emp_sex ?? "",
      emp_age ?? "",
      emp_post ?? "",
      emp_phone ?? "",
      emp_insurance ?? "",
      dep_id])
    return insertRes[0]
  }
}

module.exports = new mainService()
