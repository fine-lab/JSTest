let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { id, look_situation_m, look_num } = request;
    if (look_num == undefined) {
      look_num = 0;
    }
    //变更数据为已查看
    //无论是否已经查看都需要改次数
    var object = { id: id, look_num: look_num + 1 };
    var res = ObjectStore.updateById("GT7611AT96.GT7611AT96.abnormalevent", object);
    //写入查看记录
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    if ("1" == resultJSON.status && resultJSON.data != null) {
      var userData = resultJSON.data;
      var looklog = { StaffNew: userData[currentUser.id].id, abnormalevent: id, BaseOrg: userData[currentUser.id].orgId };
      var looklogresult = ObjectStore.insert("GT7611AT96.GT7611AT96.looklog", looklog, "91263ae6");
    } else {
      throw new Error("没有获取到当前用户的组织信息");
    }
    return { result: true };
  }
}
exports({ entryPoint: MyAPIHandler });