let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = param.data[0].id;
    let sql = "select mobile,StaffNewSysyhtUserId from GT34544AT7.GT34544AT7.gxsAreaAdmin where id='" + id + "'";
    let param1 = { sql };
    let func = extrequire("GT34544AT7.common.selectAuthRole");
    let apps = func.execute(param1);
    let { recordList } = apps;
    let log = extrequire("GT9912AT31.common.logInfo");
    log.execute({
      msg:
        "更新管理区域友互通id:\nGT34544AT7.authManager.AreaAdminAudit:\n" +
        "param.action=>" +
        param.action +
        "\n" +
        "param.billnum=>" +
        param.billnum +
        "\nGT34544AT7.GT34544AT7.gxsAreaAdmin=>recordList = \n" +
        JSON.stringify(recordList)
    });
    // 更新管理区域友互通id
    if (recordList.length > 0) {
      let app = recordList[0];
      let { mobile } = app;
      if (!!mobile) {
        let sqluser = "select SysyhtUserId,SysUser,SysUserCode from GT1559AT25.GT1559AT25.GxyUser where UserMobile='" + mobile + "'";
        let users = func.execute({ sql: sqluser });
        if (users.recordList.length > 0) {
          let user = users.recordList[0];
          if (!app.StaffNewSysyhtUserId && !!user.SysyhtUserId) {
            let upobj = { id, StaffNewSysyhtUserId: user.SysyhtUserId, _status: "Update" };
            ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsAreaAdmin", upobj, "yb7d5eb9fe");
          }
        } else {
          log.execute({ msg: "手机号=> " + mobile + " 找不到用户信息" });
        }
      } else {
        log.execute({ msg: "AreaAdminAudit=>mobile 不存在\n => recordList=" + JSON.stringify(recordList) });
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });