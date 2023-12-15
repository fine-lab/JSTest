let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 租户用户id,租户用户组织id,系统用户uuid，系统用户id,系统用户编码,电话号码
    var { gxyUserID, gxyUserOrg, SysyhtUserId, SysUser, SysUserCode, mobile } = request;
    function logs(msg) {
      let method = "GT9912AT31.auth.WritebackSysUser";
      let { bizFlowId, bizFlowInstanceId } = request;
      let queen = "";
      if (!!bizFlowId && !!bizFlowInstanceId) {
        queen += bizFlowId;
      } else {
        queen += "hellword";
      }
      let msg1 = "";
      let type = typeof msg;
      if (type == "string") {
        msg1 = msg;
      } else {
        msg1 = JSON.stringify(msg);
      }
      let nmsg = "\n" + method + "\n" + msg1;
      let logfunc = extrequire("GT9912AT31.common.logQueen");
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + nmsg;
      }
      logfunc.execute({ queen, msg: nmsg });
    }
    logs("进入WritebackSysUser======");
    logs(JSON.stringify(request));
    var sql =
      "select id,toua.id from GT3AT33.GT3AT33.test_Org_UserRole " +
      "left join GT3AT33.GT3AT33.test_Org_UserRole_AuthOrg toua on toua.test_Org_UserRole_id=id " +
      "where mobile='" +
      mobile +
      "' and SysyhtUserId is null";
    logs("sql==" + sql);
    var acc = ObjectStore.queryByYonQL(sql);
    logs("acc==" + JSON.stringify(acc));
    logs(
      "GT9912AT31.auth.WritebackSysUser\n回写用户授权角色用户信息:\n包括:\n" +
        "gxyUserID,gxyUserOrg,SysyhtUserId,SysUser,SysUserCode\n" +
        "GT9912AT31.auth.WritebackSysUser:\n" +
        sql +
        "\nrecordList = \n" +
        JSON.stringify(acc)
    );
    var objs = {};
    var upobjs = [];
    var accres = [];
    if (acc.length > 0) {
      for (let i in acc) {
        var obj = acc[i];
        if (!!objs[obj.id] && !!obj.id && !!obj.toua_id) {
          var childs = objs[obj.id];
          let obj1 = { id: obj.toua_id, SysyhtUserId, SysUser, SysUserCode, gxyUser: gxyUserID, _status: "Update" };
          childs.push(obj1);
        } else {
          objs[obj.id] = [];
          let obj2 = { id: obj.toua_id, SysyhtUserId, SysUser, SysUserCode, gxyUser: gxyUserID, _status: "Update" };
          objs[obj.id].push(obj2);
        }
      }
      let keys = Object.keys(objs);
      if (keys.length > 0) {
        for (let i in keys) {
          var key = keys[i];
          var upobj = { id: key, gxyUserID, gxyUserOrg, SysyhtUserId, SysUser, SysUserCode, test_Org_UserRole_AuthOrgList: objs[key] };
          upobjs.push(upobj);
        }
      }
      if (upobjs.length > 0) {
        var billNum = "ybd39d7e72";
        accres = ObjectStore.updateBatch("GT3AT33.GT3AT33.test_Org_UserRole", upobjs, billNum);
      }
    }
    if (accres.length == 0) {
    }
    logs("最后获取到数据:\nGT3AT33.GT3AT33.test_Org_UserRole\n" + billNum + "\nupdate=>" + JSON.stringify(upobjs) + "\nreturn=>" + JSON.stringify(accres));
    return { res: accres };
  }
}
exports({ entryPoint: MyAPIHandler });