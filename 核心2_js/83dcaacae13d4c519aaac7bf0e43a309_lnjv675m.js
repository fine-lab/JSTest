let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let app = param.data[0];
    if (app.verifystate == 2) {
      var show = {};
      //查询内容
      var sql1 = "select * from GT34544AT7.GT34544AT7.gxsAreaAdmin " + "where sysManagerArea=" + app.sysOrg + " and isEnable=1";
      var sma = ObjectStore.queryByYonQL(sql1);
      if (!!sma.length && sma.length > 0) {
        throw new Error("该组织存在区域管理员，请停用");
      }
      var sql2 = "select * from GT34544AT7.GT34544AT7.gxsOrgAdmin " + "where sysManagerOrg=" + app.sysOrg + " and isEnable=1";
      var smo = ObjectStore.queryByYonQL(sql2);
      if (!!smo.length && smo.length > 0) {
        throw new Error("该组织存在单位管理员，请停用");
      }
      var sql3 = "select * from GT34544AT7.GT34544AT7.gxsStaffMainJob " + "where sysOrg=" + app.sysOrg + " and isOnJob=1";
      var ssmj = ObjectStore.queryByYonQL(sql3);
      if (!!ssmj.length && ssmj.length > 0) {
        throw new Error("该组织存在任职，请卸任");
      }
      let req = {
        data: app
      };
      // 是否停用系统组织
      let func1 = extrequire("GT34544AT7.gxsorg.stopGxsOrgApi");
      let res = func1.execute(req);
    }
    return { context, param };
  }
}
exports({ entryPoint: MyTrigger });