let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    let currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let tenantId = currentUser.tenantId;
    let yhtUserId = currentUser.id;
    let sysId = "yourIdHere";
    let userids = [yhtUserId];
    let result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    let resultJSON = JSON.parse(result);
    let staffId;
    if ("1" == resultJSON.status && resultJSON.data) {
      //业务系统员工id
      staffId = resultJSON.data[currentUser.id].id; //员工id
    } else {
      throw new Error("获取员工ID异常");
    }
    var sql_staff = "select * from Emp.Info";
    var staffDetail = ObjectStore.queryByYonQL(sql_staff, "HRPA020");
    return { result: staffDetail };
  }
}
exports({ entryPoint: MyAPIHandler });