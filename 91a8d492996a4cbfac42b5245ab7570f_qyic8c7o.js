let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let deptCode = "";
    let deptType = "";
    //获取人员ID
    //获取人员所在部门编码
    let deptId = ObjectStore.user().deptId;
    let sql = "select code from bd.adminOrg.AdminOrgViewDept where dr=0 and id='" + deptId + "'";
    let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    //部门编码不为空
    if (res.length > 0) {
      deptType = res[0].code;
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
    let result = { type: deptType, code: deptCode };
    return {
      result
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});