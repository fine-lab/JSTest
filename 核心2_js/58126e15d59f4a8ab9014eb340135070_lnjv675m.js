let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = JSON.parse(param.requestData);
    let mobile = param.data[0].mobile;
    //查询自建员工表（通过手机号）
    let countStaffSql = "select count(id) from GT34544AT7.GT34544AT7.GxsStaff where mobile = '" + mobile + "' and (action != 'false' or action = null or action = 'true')";
    let countStaffRes = ObjectStore.queryByYonQL(countStaffSql);
    let countStaff = countStaffRes[0].id;
    let res = {};
    if (countStaff == 1) {
      let request = {};
      let func1 = extrequire("GT34544AT7.common.baseOpenApi");
      request.uri = "/yonbip/digitalModel/staff/stop";
      request.body = {};
      request.body.data = {
        id: param.data[0].sysStaff,
        enable: "1"
      };
      //如果是用户，停用员工同时移除用户
      if (param.data[0].sysUserid) {
        //参数加入用户ID会自动移除该系统员工绑定的系统用户
        request.body.data.user_id = param.data[0].sysUserid;
        //是用户--首先要判断--用户与角色是否已经解绑
        let UserRoleSql = "select count(id) from GT3AT33.GT3AT33.test_Org_UserRole where UserOrg = '" + param.data[0].org_id + "' and dr = 0 and mobile = '" + mobile + "'";
        let UserRoleRes = ObjectStore.queryByYonQL(UserRoleSql);
        let countUserRole = UserRoleRes[0].id;
        if (countUserRole == 0) {
          //执行停用员工操作
          res = func1.execute(request).res;
          //停用系统员工过后，该员工所有的任职都需要打上任职结束时间，是否任职变为否。
          let gxsStaffMainJob_Sql = "select id from GT34544AT7.GT34544AT7.gxsStaffMainJob where GxsStaffFk = '" + param.data[0].id + "' and isOnJob != 0 and dr = 0";
          let gxsStaffMainJob_res = ObjectStore.queryByYonQL(gxsStaffMainJob_Sql);
          if (gxsStaffMainJob_res.length > 0) {
            for (let i = 0; i < gxsStaffMainJob_res.length; i++) {
              let gxsStaffMainJob_object = { id: gxsStaffMainJob_res[i].id, isOnJob: "0", endDate: requestData.pubts };
              let gxsStaffMainJob_object_res = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", gxsStaffMainJob_object, "f5ad586c");
            }
          }
        } else {
          throw new Error("该员工绑定的用户，有角色权限未删除。\n请先删除角色权限后后再进行停用员工操作！");
        }
      } else {
        //不是用户就直接停用员工
        res = func1.execute(request).res;
        //停用系统员工过后，该员工所有的任职都需要打上任职结束时间，是否任职变为否。
        let gxsStaffMainJob_Sql = "select id from GT34544AT7.GT34544AT7.gxsStaffMainJob where GxsStaffFk = '" + param.data[0].id + "' and isOnJob != 0 and dr = 0";
        let gxsStaffMainJob_res = ObjectStore.queryByYonQL(gxsStaffMainJob_Sql);
        if (gxsStaffMainJob_res.length > 0) {
          for (let i = 0; i < gxsStaffMainJob_res.length; i++) {
            let gxsStaffMainJob_object = { id: gxsStaffMainJob_res[i].id, isOnJob: "0", endDate: requestData.pubts };
            let gxsStaffMainJob_object_res = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", gxsStaffMainJob_object, "f5ad586c");
          }
        }
      }
    } else if (countStaff > 1) {
      throw new Error("该员工在多个单位有任职！\n停用功能正在开发中,请稍等...");
    } else if (countStaff == 0) {
      throw new Error("该员工已经删除！");
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });