let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取传来的系统组织id数组
    let arr = request.arr;
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      let sql = "select sys_code from GT34544AT7.GT34544AT7.IndustryOwnOrg where sys_orgId = " + arr[i];
      var res1 = ObjectStore.queryByYonQL(sql);
      res.push(res1[0].sys_code + "OrgAdmin");
      res.push(res1[0].sys_code + "AreaAdmin");
    }
    if (res.length === 0) {
      res = ["111111111111111111"];
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });