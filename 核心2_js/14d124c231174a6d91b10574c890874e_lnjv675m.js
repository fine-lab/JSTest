let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let canSetRole = request.canSetRole;
    let recordId = request.recordId;
    let OnlyRoles = {};
    if (recordId === undefined) {
      throw new Error("请新增记录");
    }
    let sql = "select userIdWho from GT34544AT7.GT34544AT7.WhoAuthorizedByWhom where id =" + recordId;
    let userId = ObjectStore.queryByYonQL(sql, "developplatform")[0].userIdWho;
    // 获取当前被授权人的角色
    let func2 = extrequire("GT34544AT7.MyRole.getMyRoleByUserId");
    request.userId = userId;
    let res2 = func2.execute(request).res;
    let arr = [];
    for (let i in res2) {
      let x = res2[i];
      var object = { sysRoleId: x.sysRoleId };
      var results = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.OnlyRole", object);
      let result = results[0];
      if (results.length === 0) {
        throw new Error("results " + JSON.stringify(results) + " sysRoleId = " + x.sysRoleId);
      }
      OnlyRoles[x.sysRoleId] = result;
      let s = {
        sysRole: x.sysRoleId,
        onlyRole: result.id,
        onlyRoleId: result.id,
        sysRoleId: x.sysRoleId,
        sysRoleCode: x.sysRoleCode,
        recordId: recordId,
        sysRoleName: x.sysRoleName,
        isSelect: "true"
      };
      arr[x.sysRoleId] = s;
    }
    // 获取可选择的角色
    let func1 = extrequire("GT34544AT7.OnlyRole.selectTrueOnlyRole");
    let res1 = func1.execute(request).res;
    let arr1 = {};
    for (let i in res1) {
      let x = res1[i];
      let s = {
        sysRole: x.sysRoleId,
        onlyRole: x.id,
        onlyRoleId: x.id,
        sysRoleId: x.sysRoleId,
        sysRoleCode: x.sysRoleCode,
        recordId: recordId,
        sysRoleName: x.sysRoleName,
        isSelect: "false"
      };
      arr1[x.sysRoleId] = s;
    }
    let arr2 = [];
    for (let key in arr1) {
      if (arr[key] !== null && arr[key] !== undefined) {
        arr2.push(arr[key]);
      } else if (arr1[key] !== null && arr1[key] !== undefined) {
        arr2.push(arr1[key]);
      }
    }
    // 剩余的可授权角色加入
    var res = arr2;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });