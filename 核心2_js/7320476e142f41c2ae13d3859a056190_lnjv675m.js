let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let args = param.data[0];
    let sysRoleId = args.sysRoleId;
    let sysRoleCode = args.sysRoleCode;
    let recordId = args.recordId;
    let isSelect = args.isSelect;
    let sql = "select userIdWho from GT34544AT7.GT34544AT7.WhoAuthorizedByWhom where id=" + recordId;
    let result = ObjectStore.queryByYonQL(sql, "developplatform");
    let res = {};
    if (result.length === 0) {
      throw new Error("系统未查到记录，请联系管理员");
    } else if (result.length > 1) {
      throw new Error("系统有重复记录，请联系管理员");
    } else {
      let record = result[0];
      // 获取被授权人userId
      let whoUserid = record.userIdWho;
      let funcx = extrequire("GT34544AT7.roles.isUserHave");
      let req = {
        userId: whoUserid,
        roleId: sysRoleId
      };
      let isIn = funcx.execute(req).res.result;
      req.roleCode = sysRoleCode;
      if (isSelect === true || isSelect === "true") {
        if (isIn === false || isIn === "false") {
          let func1 = extrequire("GT34544AT7.roles.bindRoleByRicUid");
          let res1 = func1.execute(req);
          let func3 = extrequire("GT34544AT7.OnlyRoleSelect.selectRoleToMyRole");
          req.selectRole = args;
          req.recordId = recordId;
          let res3 = func3.execute(req);
          res = { userId: whoUserid, bind: sysRoleCode };
        }
      } else if (isSelect === false || isSelect === "false" || isSelect === null) {
        if (isIn === true || isIn === "true") {
          let func2 = extrequire("GT34544AT7.roles.unBindRoleByRicUid");
          req.userId = whoUserid;
          req.roleId = sysRoleId;
          let res2 = func2.execute(req);
          let func4 = extrequire("GT34544AT7.OnlyRoleSelect.deleteSetRoByUIdRId");
          let res4 = func4.execute(req);
          res = { userId: whoUserid, unbind: sysRoleCode };
        }
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });