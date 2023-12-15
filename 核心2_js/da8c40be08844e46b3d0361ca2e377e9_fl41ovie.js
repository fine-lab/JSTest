let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { id, look_situation_m, look_num } = request;
    if (look_num == undefined) {
      look_num = 0;
    }
    //无论是否已经查看都需要改次数   -----------------更新异常记录表的查看次数
    var object = { id: id, look_num: look_num + 1 };
    var res = ObjectStore.updateById("GT8053AT100.GT8053AT100.abnormalevent2", object);
    //写入阅读记录表-------------------------------------------------------------------
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    if ("1" == resultJSON.status && resultJSON.data != null) {
      var userData = resultJSON.data;
      //需要从数据库中查询出当前人的大区信息、门店信息--TODO:
      var psnid = userData[currentUser.id].id;
      var belongArea = "select '' as id ,id as areaid from GT8053AT100.GT8053AT100.area2 where StaffNew='" + psnid + "'";
      var belongR = ObjectStore.queryByYonQL(belongArea);
      if (undefined == belongR || belongR.length == 0) {
        var belongStore = "select id,area.id as areaid from GT8053AT100.GT8053AT100.stores where StaffNew='" + psnid + "'";
        belongR = ObjectStore.queryByYonQL(belongStore);
      }
      var looklog;
      if (belongR.length > 0) {
        looklog = { StaffNew: psnid, abnormalevent: id, area: belongR[0].areaid, stores: belongR[0].id };
      } else {
        looklog = { StaffNew: psnid, abnormalevent: id };
      }
      var looklogresult = ObjectStore.insert("GT8053AT100.GT8053AT100.looklog2", looklog, "43472ef5");
    } else {
      throw new Error("没有获取到当前用户的组织信息");
    }
    return { result: true };
  }
}
exports({ entryPoint: MyAPIHandler });