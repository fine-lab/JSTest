let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //结果区域-------------------------------begin
    var edited,
      attention = 0;
    //结果区域--------------------------------end
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      var userid = userData[currentUser.id].id;
      //获取当前用户的关注列表
      var attentionSql = "select id from GT7611AT96.GT7611AT96.attentiondoc where StaffNew = '" + userid + "'";
      var attentionRes = ObjectStore.queryByYonQL(attentionSql);
      if (undefined != attentionRes && null != attentionRes) {
        attention = attentionRes.length;
      }
      //从阅读记录中获取当前的查看数据
      var lookSql = "select distinct abnormalevent from GT7611AT96.GT7611AT96.looklog where StaffNew = '" + userid + "'";
      var lookRes = ObjectStore.queryByYonQL(lookSql);
      if (undefined != lookRes && null != lookRes) {
        edited = lookRes;
      }
    } else {
      throw new Error("没有获取到当前用户的组织信息");
    }
    return { edited: edited, attention: attention };
  }
}
exports({ entryPoint: MyAPIHandler });