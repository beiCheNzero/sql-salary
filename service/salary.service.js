const connections = require('../app/app.datebase')

class salaryService {
  // 查询用户id
  async getUserName(emp_id) {
    const statement = `select emp_name from emp where emp_id = ?`
    const emp_name = (await connections.execute(statement, [emp_id]))[0][0].emp_name
    return emp_name
  }

  // 查询实发工资(工资条)
  async getUserSalary(emp_id) {
    const statement = `select * from emp_salary where emp_id = ?`
    const dbRes = await connections.execute(statement, [emp_id])
    return dbRes[0][0]
  }

  // 查询补贴
  async getSubsitySalary(emp_id) {
    const statement = `select * from subsidy where emp_id = ?`
    const dbRes = await connections.execute(statement, [emp_id])
    return dbRes[0][0]
  }

  // 查询月工作详情
  async getWorkDay(emp_id) {
    const statement = `select * from attendance where emp_id = ?`
    const dbRes = await connections.execute(statement, [emp_id])
    return dbRes[0][0]
  }

  // 查询加班和缺勤应扣工资/天
  async getAddSubSalary(emp_id) {
    const statement = `SELECT dep_id FROM emp WHERE emp_id = ?`
    const dep_id = (await connections.execute(statement, [emp_id]))[0][0].dep_id
    const statement2 = `select dep_jb_salary,dep_absent_salary from department where dep_id = ?`
    const dbRes = (await connections.execute(statement2, [dep_id]))[0]
    return dbRes[0]
  }
}

module.exports = new salaryService()
