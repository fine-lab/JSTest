let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let deptCode = "";
    let deptType = "";
    //获取人员ID
    let staffId = ObjectStore.user().staffId;
    //获取人员所在部门编码
    let sql = "select dept_id.code from bd.staff.StaffJob where dr=0 and lastestjob=1 and staff_id='" + staffId + "'";
    let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    //部门编码不为空
    if (res.length > 0) {
      if (staffId === "2424360431358208") deptType = "84201";
      else deptType = res[0].dept_id_code;
      deptCode = deptType;
      //判断部门是否为高端部门
      if (deptType.length >= 5 && substring(deptType, 0, 5) === "84201") {
        deptType = "高端";
      } else if (deptType.length >= 5 && substring(deptType, 0, 5) === "84202") {
        deptType = "中端";
      }
    } else {
      deptType = "";
    }
    let result = {
      type: deptType,
      code: deptCode
    };
    return {
      result
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});