const {
  getUserSalary,
  getSubsitySalary,
  getWorkDay,
  getAddSubSalary,
  getUserName
} = require('../service/salary.service')

class salaryController {
  // 处理用户工资部分
  async handleUserSalary(req, res) {
    const { id } = req.params
    if( !id ) res.json({
      code: -1,
      msg: '查询工资必须包含用户id'
    })
    // 查询用户id
    const emp_name = await getUserName(id)

    // 根据id查询用户的实发工资
    let {
      kq_salary,
      ach_salary,
      jt_salary,
      total_salary,
      sub_salary,
      net_salary
    } = await getUserSalary(id)
    // 获取用户补贴工资
    const {
      traffic,
      meal,
      high_temp
    } = await getSubsitySalary(id)
    // 获取用户工作时间
    const {
      work_day,
      absent_day,
      leave_day,
      ill_day
    } = await getWorkDay(id)
    // 获取部门加班工资和缺勤工资
    const {
      dep_jb_salary,
      dep_absent_salary
    } = await getAddSubSalary(id)

    // 考勤工资
    kq_salary = (work_day >= 22 ? (work_day-22)*dep_jb_salary : -(absent_day*dep_absent_salary)) +
                work_day * 100 + (ill_day * dep_jb_salary) * 0.5
    // 津贴
    jt_salary = traffic + meal + high_temp
    // 应发工资
    total_salary = kq_salary + ach_salary + jt_salary
    // 实发工资
    net_salary = total_salary - sub_salary
    res.json({
      code: 1,
      msg: `id为${id}的用户工资如下`,
      data: [
        {
          emp_name,
          work_day,
          absent_day,
          leave_day,
          ill_day,
          kq_salary,
          ach_salary,
          traffic,
          meal,
          high_temp,
          total_salary,
          sub_salary,
          net_salary
        }
      ]
    })
  }
}

module.exports = new salaryController()
