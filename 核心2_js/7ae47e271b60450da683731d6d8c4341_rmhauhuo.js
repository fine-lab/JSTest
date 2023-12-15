let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = "select id as id,"; //员工id
    sql = sql + "code as code,"; //员工编码
    sql = sql + "name as name,"; //员工姓名
    sql = sql + "mobile as phone,"; //员工电话
    sql = sql + "officeTel as mobile,"; //办公室电话
    sql = sql + "email as mailbox,"; //邮箱
    sql = sql + "staffDefines.attrext10 as office_address,"; //办公地点
    sql = sql + "superior.name as superior_name,"; //直接上级名称
    sql = sql + "job.jobId as duties_id,"; //职务id
    sql = sql + "duty.name as duties_name,"; //职务名称
    sql = sql + "bumen.id as department_id,"; //部门Id
    sql = sql + "bumen.code as department_code,"; //部门编码
    sql = sql + "bumen.name as department_name,"; //部门名称
    sql = sql + "bumenParent.id as department_parent_id,"; //上级部门Id
    sql = sql + "bumenParent.name as department_parent_name,"; //上级部门名称
    sql = sql + "staffDefines.attrext9 as login_name,"; //登陆名
    sql = sql + "enable as status "; //员工状态（0:未启用，1启用，2停用）
    sql = sql + "from hred.staff.Staff ";
    sql = sql + "left join hred.staff.StaffJob job on job.staffId = id "; //任职信息
    sql = sql + "left join hred.staff.Staff superior on superior.id = job.director "; //上级主管
    sql = sql + "left join bd.duty.Duty duty on duty.id = job.jobId "; //职务信息
    sql = sql + "left join bd.adminOrg.AdminOrgVO bumen on bumen.id = deptId "; //部门
    sql = sql + "left join bd.adminOrg.AdminOrgVO bumenParent on bumenParent.id = bumen.parent "; //上级部门
    sql = sql + "where job.lastFlag = 'true' ";
    if (request != null && request != "" && request != undefined && request.staffCode != null && request.staffCode != "" && request.staffCode != undefined) {
      sql = sql + "and code in (" + request.staffCode + ") ";
    }
    sql = sql + "order by createTime asc limit " + request.pageSize + "," + request.pageNum + " ";
    var dataList = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
    console.log(sql + "查询结果集合：" + JSON.stringify(dataList));
    return { dataList };
  }
}
exports({ entryPoint: MyAPIHandler });