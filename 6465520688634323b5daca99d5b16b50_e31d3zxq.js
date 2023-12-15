let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let staffOfCurrentUser = {};
    let mainOrgId = request.mainOrgId;
    //获取当前用户的身份信息-----------
    let currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    //查询员工基本信息
    let sql = "select id,code,name, deptId, deptId.code deptCode, deptId.name deptName from hred.staff.Staff where userId = '" + currentUser.id + "'";
    let staffInfo = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
    //查询员工组织信息
    if (staffInfo.length > 0) {
      let orgSql = "select orgId,orgId.code orgCode, orgId.name orgName from hred.staff.StaffOrgRel where staffId = '" + staffInfo[0].id + "' and endFlag = '0' ";
      let staffOrgInfo = ObjectStore.queryByYonQL(orgSql, "hrcloud-staff-mgr");
      if (staffOrgInfo.length > 0 && staffOrgInfo[0].orgId == mainOrgId) {
        staffInfo[0].orgId = staffOrgInfo[0].orgId;
        staffInfo[0].orgCode = staffOrgInfo[0].orgCode;
        staffInfo[0].orgName = staffOrgInfo[0].orgName;
      }
      staffOfCurrentUser = staffInfo[0];
    }
    //查询GSP参数中配置的默认验收人，默认复核人
    let GSPConfigDefaultUser = {};
    let sqlStr = " select id,defaultYsr,defaultFhr from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where dr = 0  and org_id = '" + mainOrgId + "'";
    let gspParameterArray = ObjectStore.queryByYonQL(sqlStr, "sy01");
    if (gspParameterArray.length > 0) {
      if (gspParameterArray[0].defaultYsr != undefined) {
        let selectYsrUserSql = "select staff_id,staff_id.name staffName,dept_id,dept_id.name deptName from bd.staff.StaffMainJob where staff_id = '" + gspParameterArray[0].defaultYsr + "'";
        let ysrUserRes = ObjectStore.queryByYonQL(selectYsrUserSql, "ucf-staff-center");
        if (ysrUserRes.length > 0) {
          GSPConfigDefaultUser.defaultYsr = ysrUserRes[0].staff_id;
          GSPConfigDefaultUser.defaultYsrName = ysrUserRes[0].staffName;
          GSPConfigDefaultUser.defaultYsrDep = ysrUserRes[0].dept_id;
          GSPConfigDefaultUser.defaultYsrDepName = ysrUserRes[0].deptName;
        }
      }
      if (gspParameterArray[0].defaultFhr != undefined) {
        let selectFhrUserSql = "select staff_id,staff_id.name staffName,dept_id,dept_id.name deptName from bd.staff.StaffMainJob where staff_id = '" + gspParameterArray[0].defaultFhr + "'";
        let fhrUserRes = ObjectStore.queryByYonQL(selectFhrUserSql, "hrcloud-staff-mgr");
        if (fhrUserRes.length > 0) {
          GSPConfigDefaultUser.defaultFhr = fhrUserRes[0].staff_id;
          GSPConfigDefaultUser.defaultFhrName = fhrUserRes[0].staffName;
          GSPConfigDefaultUser.defaultFhrDep = fhrUserRes[0].dept_id;
          GSPConfigDefaultUser.defaultFhrDepName = fhrUserRes[0].deptName;
        }
      }
    }
    staffOfCurrentUser["GSPConfigDefaultUser"] = GSPConfigDefaultUser;
    return { staffOfCurrentUser };
  }
}
exports({ entryPoint: MyAPIHandler });