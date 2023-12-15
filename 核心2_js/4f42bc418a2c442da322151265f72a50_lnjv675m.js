let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ownorg = request.ownorg;
    if (!(ownorg.is_area_org1 === "1" || ownorg.is_area_org1 === 1 || ownorg.is_area_org1 === "true" || ownorg.is_area_org1 === true)) {
      throw new Error("非区域性组织");
    }
    let table = "GT34544AT7.GT34544AT7.IndustryOwnOrg";
    let conditions = { parent: ownorg.id, sys_code: ownorg.sys_code + "AreaAdmin" };
    let res1 = ObjectStore.selectByMap(table, conditions);
    var currentUser = JSON.parse(AppContext()).currentUser;
    var tenantId = currentUser.tenantId;
    // 如果没有就创建区域性组织
    let org_admin = null;
    if (res1.length === 0) {
      var new_org_id = ownorg.sys_orgId;
      let fun3 = extrequire("GT34544AT7.org.areaDeptInsert");
      request.par = new_org_id;
      request.code = ownorg.sys_code;
      request.name = ownorg.name;
      request._status = "Insert";
      let rs3 = fun3.execute(request).res;
      let result3 = rs3.data;
      if (rs3.code !== 200 && rs3.code !== "200") {
        throw new Error("部门显示错误:" + rs3.message);
      }
      // 同步新建自有组织
      let func4 = extrequire("GT34544AT7.org.syncSysDept");
      request.dept = result3;
      request.is_dept = "1";
      request.is_area_org = "0";
      request.is_area_org1 = "0";
      request.par = ownorg.id;
      org_admin = func4.execute(request).acc;
      let change = {
        id: "youridHere",
        parent: "ownOrgParent",
        own_enable: "sysEnable",
        name: "sysOrgName",
        sys_orgId: "yourIdHere",
        sys_parent: "sysPrent",
        sys_code: "sysCode",
        shortname: "sysShortname",
        is_area_org1: "isArea"
      };
      let myorglist = [];
      // 获取IndustryOwnOrg所有数据
      let iorg = org_admin;
      let obj = {};
      for (let j in change) {
        let key = j;
        let value = change[j];
        if (iorg[key] !== undefined) {
          obj[value] = iorg[key];
        }
      }
      if (iorg.parent !== undefined) {
        obj.guanlianguanxi = iorg.parent;
      }
      myorglist.push(obj);
      let func1 = extrequire("GT34544AT7.MyOrg.insertBatchMyOrg");
      request.list = myorglist;
      let res = func1.execute(request).res;
    } else {
      org_admin = res1[0];
    }
    return { res: org_admin };
  }
}
exports({ entryPoint: MyAPIHandler });