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
    var allData;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
    } else {
      throw new Error("获取员工信息异常");
    }
    //先判断是否是集团的人员
    var orgsql = "select StaffNew from GT28220AT30.GT28220AT30.org0519 where StaffNew='" + userid + "'";
    var orgres = ObjectStore.queryByYonQL(orgsql);
    if (orgres.length > 0) {
      allData = "all";
    } else {
      //判断是否为管理人员 -----一个大区的区长默认为是有下属门店的，根据门店来获取区长信息
      var managerSql =
        "select StaffNew, id, area.StaffNew as areapsn,area.id as areaid from GT28220AT30.GT28220AT30.store0519 where " + " StaffNew='" + userid + "' or area.StaffNew ='" + userid + "'";
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
    }
    return { res: result, allData: allData };
  }
}
exports({ entryPoint: MyAPIHandler });