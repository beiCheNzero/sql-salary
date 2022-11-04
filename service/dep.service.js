const connections = require('../app/app.datebase')

class depService {
  // 查询不同职位/部门的加班工资和缺勤工资
  async getExtraSalary(emp_id) {
    const statement = `SELECT * FROM department WHERE dep_id = (SELECT dep_id FROM emp WHERE emp_id = ?)`
    const dbRes = await connections.execute(statement, [emp_id])
    return dbRes[0][0]
  }
  // 获取部门信息
  async getDepInfo(payload) {
    const {
      dep_id,
      dep_name,
      emp_id,
      dep_intr,
      limit,
      offset
    } = payload
    const statement = `select * from department where dep_id like ? and dep_name like ? and emp_id like ? and dep_intr like ? limit ? offset ?`
    const dbRes = await connections.execute(statement, [
      dep_id ? `%${dep_id}%` : '%',
      dep_name ? `%${dep_name}%` : '%',
      emp_id ? `%${emp_id}%` : '%',
      dep_intr ? `%${dep_intr}%` : '%',
      limit,
      offset
    ])
    return dbRes[0]
  }
  // 部门人数统计
  async getDepUserCount(paylaod) {
    const {
      dep_id,
      dep_name,
      emp_id,
      dep_intr,
      limit,
      offset
    } = paylaod
    const statement = `SELECT COUNT(dep_id) as totalCount FROM (select * from department where
      dep_id like ? and dep_name like ? and emp_id like ? and dep_intr like ? limit ? offset ?) as dep`
    const dbRes = await connections.execute(statement, [
      dep_id ? `%${dep_id}%` : '%',
      dep_name ? `%${dep_name}%` : '%',
      emp_id ? `%${emp_id}%` : '%',
      dep_intr ? `%${dep_intr}%` : '%',
      limit,
      offset
    ])
    return dbRes[0][0].totalCount
  }
  // 修改部门信息
  async patchDepInfo(payload) {
    const {
      id,
      dep_name,
      emp_id,
      dep_intr,
      dep_jb_salary,
      dep_absent_salary
    } = payload
    const statement = `update department set dep_name = ?, emp_id = ?, dep_intr = ?,
    dep_jb_salary = ?, dep_absent_salary = ? where dep_id = ?`
    const dbRes = await connections.execute(statement, [
      dep_name,
      emp_id,
      dep_intr,
      dep_jb_salary,
      dep_absent_salary,
      id
    ])
    return dbRes[0]
  }
  // 添加部门
  async getAddDep(payload) {
    const {
      dep_name,
      emp_id,
      dep_intr,
      dep_jb_salary,
      dep_absent_salary
    } = payload
    const statement = `insert into department (dep_name,emp_id,dep_intr,dep_jb_salary,dep_absent_salary) value (?,?,?,?,?)`
    const data = await connections.execute(statement, [
      dep_name ?? '',
      emp_id ?? '',
      dep_intr ?? '',
      dep_jb_salary ?? '',
      dep_absent_salary ?? ''
    ])
    return data[0]
  }
  // 删除部门
  async delDep(dep_id) {
    const statement  = `delete from department where dep_id = ?`
    return (await connections.execute(statement, [dep_id]))[0]
  }
}

module.exports = new depService()
