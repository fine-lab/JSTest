let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let deptType = "";
    //获取人员ID
    let staffId = ObjectStore.user().staffId;
    //获取人员所在部门编码
    let sql = "select dept_id.code from bd.staff.Staff where dr=0 and id='" + staffId + "'";
    let dept_code = ObjectStore.queryByYonQL(sql, "ucf-staff-center");
    //部门编码不为空
    if (dept_code.length > 0) {
      deptType = dept_code[0].dept_id_code;
      //判断部门是否为高端部门
      if (deptType.length >= 5 && substring(deptType, 0, 5) === "84201") {
        deptType = "高端";
      } else if (deptType.length >= 5 && substring(deptType, 0, 5) === "84202") {
        deptType = "中端";
      }
    } else {
      deptType = "";
    }
    return {
      deptType
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});