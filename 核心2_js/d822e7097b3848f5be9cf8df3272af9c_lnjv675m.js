let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前用户的用户信息
    let res1 = JSON.parse(AppContext());
    //值是一个currentUser对象
    // 获取当前用户的员工id
    let id = res1.currentUser.id;
    let sql1 = "select sysManagerArea from GT34544AT7.GT34544AT7.gxsAreaAdmin where StaffNewSysyhtUserId = '" + id + "' and isEnable = '1'";
    //值是一个数组
    //执行sql，获取当前用户在--行业用户表--的userId
    let res2 = ObjectStore.queryByYonQL(sql1, "developplatform");
    let arr = [];
    for (let j = 0; j < res2.length; j++) {
      arr.push(res2[j].sysManagerArea);
    }
    return { arr };
  }
}
exports({ entryPoint: MyAPIHandler });