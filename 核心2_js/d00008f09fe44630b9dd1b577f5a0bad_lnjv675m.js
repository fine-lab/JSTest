let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前用户的用户信息
    let res1 = JSON.parse(AppContext());
    //值是一个currentUser对象
    // 获取当前用户的员工id
    let id = res1.currentUser.id;
    let sql1 = "select sysManagerOrg from GT34544AT7.GT34544AT7.gxsAreaAdmin where StaffNewSysyhtUserId = '" + id + "' and isEnable = '1'";
    //值是一个数组
    let res2 = ObjectStore.queryByYonQL(sql1, "developplatform");
    let arr = [];
    for (let j = 0; j < res2.length; j++) {
      arr.push(res2[j].sysManagerOrg);
    }
    return { arr };
  }
}
exports({ entryPoint: MyAPIHandler });