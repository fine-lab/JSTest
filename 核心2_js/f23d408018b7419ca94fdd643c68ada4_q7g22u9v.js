let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var userid;
    var allData;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      var userData = resultJSON.data;
      userid = userData[currentUser.id].id;
    } else {
      throw new Error("获取员工信息异常");
    }
    var orgSql = "select StaffNew from GT13898AT21.GT13898AT21.org where StaffNew = '" + userid + "'";
    var orgRes = ObjectStore.queryByYonQL(orgSql);
    //如果是集团的人员，那么具备所有权限
    if (orgRes != null && orgRes.length > 0) {
      allData = "all";
    } else {
      //判断是否为管理人员，大区的区长默认有下属门店，根据门店来获取区长信息
      var managerSql = "select StaffNew, id, area.StaffNew as areapsn, area.id as areaid from GT13898AT21.GT13898AT21.store where " + "StaffNew='" + userid + "' or area.StaffNew = '" + userid + "'";
      var res = ObjectStore.queryByYonQL(managerSql);
      //权限范围内的异常创建人，根据人来筛选
      var result = [];
      //如果是管理人员
      if (res.length > 0) {
        res.forEach((data) => {
          //如果是区长
          if (userid == data.areapsn) {
            result.push(data.StaffNew);
          }
        });
        result.push(userid);
      }
    }
    return { res: result, allData: allData };
  }
}
exports({ entryPoint: MyAPIHandler });