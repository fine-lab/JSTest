let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      // 组装入参的json对象（不要传string）
      var json = {
        staff: userData[currentUser.id].id, // 业务系统员工id
        clockintime: request.date,
        longitude: request.res.longitude,
        latitude: request.res.latitude
      };
      // 执行插入语句
      var res = ObjectStore.insert("GT68526AT7.GT68526AT7.clockinrecord", json, "ff9ad324");
      return {
        res
      };
    } else {
      throw new Error("获取员工信息异常");
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});