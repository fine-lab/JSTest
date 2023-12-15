let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { id, look_situation_m, look_num } = request;
    if (look_num == undefined) {
      look_num = 0;
    }
    //无论是否已经查看都需要改次数   -----------------更新异常记录表的查看次数
    var object = { id: id, look_num: look_num + 1 };
    var res = ObjectStore.updateById("GT29517AT29.GT29517AT29.abnormalevent_3", object);
    //获取当前用户的员工信息-------------------------------------------------------------------
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    if ("1" != resultJSON.status || resultJSON.data == null) {
      throw new Error("没有获取到当前用户的组织信息");
    }
    //写入阅读记录表-------------------------------------------------------------------
    var userData = resultJSON.data;
    //需要从数据库中查询出当前人的大区信息、门店信息--TODO:
    var psnid = userData[currentUser.id].id;
    var belongArea = "select '' as id ,id as areaid from GT29517AT29.GT29517AT29.area_3 where StaffNew='" + psnid + "'";
    var belongR = ObjectStore.queryByYonQL(belongArea);
    if (undefined == belongR || belongR.length == 0) {
      var belongStore = "select id,area_3.id as areaid from GT29517AT29.GT29517AT29.store where StaffNew='" + psnid + "'";
      belongR = ObjectStore.queryByYonQL(belongStore);
    }
    var looklog;
    if (belongR.length > 0) {
      looklog = { StaffNew: psnid, abnormalevent_3: id, area_3: belongR[0].areaid, store: belongR[0].id };
    } else {
      looklog = { StaffNew: psnid, abnormalevent_3: id };
    }
    var looklogresult = ObjectStore.insert("GT29517AT29.GT29517AT29.booklog", looklog, "f9575c6c");
    return { result: true };
  }
}
exports({ entryPoint: MyAPIHandler });