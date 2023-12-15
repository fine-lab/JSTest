let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { params } = request;
    var { objuri, billnum, mainid, billsaveparams } = params;
    //主流程审批人
    var mainidStr = "";
    mainid.map((t) => {
      mainidStr += t.main + ",";
    });
    var staffIdMaps = {};
    //查询
    var querysql = "select id,creator as " + billsaveparams + " from " + objuri + " where 1=1 ";
    var queryres = ObjectStore.queryByYonQL(querysql);
    queryres.map((t) => {
      //允许主流程审批人和制单人可查看
      try {
        let staffid = mainidStr + getStaffId(t[billsaveparams]);
        t[billsaveparams] = staffid;
      } catch (e) {
        throw new Error("错误数据：存在单据的制单人可能不属于员工，请检查！" + e);
      }
    });
    //更新主流程审批人数据
    var res = ObjectStore.updateBatch(objuri, queryres);
    //获取员工id
    function getStaffId(userid) {
      if (staffIdMaps[userid] != undefined) {
        return staffIdMaps[userid];
      } else {
        //根据制单人用户id去查询员工表
        var tenantId = JSON.parse(AppContext()).currentUser.tenantId;
        var sysId = "yourIdHere";
        var result = listOrgAndDeptByUserIds(sysId, tenantId, [userid]);
        var resultJSON = JSON.parse(result);
        var userInfoR;
        if ("1" == resultJSON.status && resultJSON.data != null) {
          var userData = resultJSON.data;
          //业务系统员工id
          staffIdMaps[userid] = userData[userid].id;
          return userData[userid].id;
        } else {
          throw new Error("获取员工信息异常");
        }
      }
    }
    return { res: staffIdMaps };
  }
}
exports({ entryPoint: MyAPIHandler });