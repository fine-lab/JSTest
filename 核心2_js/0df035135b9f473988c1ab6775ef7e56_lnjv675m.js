let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var app = param.return;
    // 如果此主表需要删除
    if (app.mainOperaState == "1" && !!app.testOrgUserRole) {
      var objs = [];
      var sql = "select id from GT3AT33.GT3AT33.test_History_AuthOrg where test_History_AuthOrgFk='" + app.test_HistoryOrg_UserRole + "' and Binded=" + 1;
      var res = ObjectStore.queryByYonQL(sql);
      for (var i in res) {
        var obj = res[i];
        obj.Binded = "2";
        objs.push(obj);
      }
      // 记录表修改
      // 修改孙表记录为解绑
      var childs = ObjectStore.updateBatch("GT3AT33.GT3AT33.test_History_AuthOrg", objs, "yb68d4fe6c");
      if (childs.length == 0) {
        throw new Error("未查询到绑定完成的记录数据");
      } else if (!!app.test_HistoryOrg_UserRole) {
        // 修改子表记录为已弃审修改删除标签
        var authrole = { id: app.test_HistoryOrg_UserRole, DelFlag: app.testOrgUserRole };
        var authroleselect = ObjectStore.updateById("GT3AT33.GT3AT33.test_HistoryOrg_UserRole", authrole, "ybe591573d");
        // 操作表更新为已操作状态
        var upobj = { id: app.id, mainOperaState: "2" };
        var res = ObjectStore.updateById("GT3AT33.GT3AT33.RoleOpera", upobj, "yb1a5b8cf1");
      } else {
        throw new Error("找不到子表");
      }
    } else if (app.mainOperaState == "0" && app.childOperaState == "1" && !!app.testOrgUserRole_AuthOrg) {
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });