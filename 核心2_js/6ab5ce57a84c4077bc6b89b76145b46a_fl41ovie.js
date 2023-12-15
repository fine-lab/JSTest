let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var userid;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
    } else {
      throw new Error("获取员工信息异常");
    }
    //判断是否为管理人员
    var managerSql =
      "select StaffNew, id, area_m.StaffNew as areapsn,area_m.id as areaid from GT7611AT96.GT7611AT96.stores_my where " + " StaffNew='" + userid + "' or area_m.StaffNew ='" + userid + "'";
    var res = ObjectStore.queryByYonQL(managerSql);
    //权限范围内的异常创建人，根据人来筛选
    var result = [];
    if (res.length > 0) {
      //说明是管理人员   --默认身份互斥
      res.forEach((data) => {
        if (userid == data.areapsn) {
          //说明是区长
          result.push(data.StaffNew);
        }
      });
      //加入自身
      result.push(userid);
    }
    return { res: result };
  }
}
exports({ entryPoint: MyAPIHandler });