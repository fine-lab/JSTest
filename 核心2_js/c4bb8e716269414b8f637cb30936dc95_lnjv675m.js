let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ownorg = request.ownorg;
    let admincode = ownorg.sys_code + "OrgAdmin";
    let table = "GT34544AT7.GT34544AT7.IndustryOwnOrg";
    let conditions = { parent: ownorg.id, sys_code: admincode };
    let res1 = ObjectStore.selectByMap(table, conditions);
    var currentUser = JSON.parse(AppContext()).currentUser;
    var tenantId = currentUser.tenantId;
    // 如果没有就创建区域性组织
    let org_dept = null;
    if (res1.length === 0) {
      var new_org_id = ownorg.sys_orgId;
      let fun3 = extrequire("GT34544AT7.org.orgDeptInsert");
      request.par = new_org_id;
      request.code = ownorg.sys_code;
      request.name = ownorg.name;
      request._status = "Insert";
      let res3 = fun3.execute(request);
      let result3 = res3.res.data;
      // 同步新建自有组织
      let func4 = extrequire("GT34544AT7.org.syncSysDept");
      let req = {};
      req.dept = result3;
      req.is_dept = "1";
      req.is_area_org = "0";
      req.is_area_org1 = "0";
      req.par = ownorg.id;
      org_dept = func4.execute(req).acc;
    } else {
      org_dept = res1[0];
    }
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
    let iorg = org_dept;
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
    return { res: org_dept };
  }
}
exports({ entryPoint: MyAPIHandler });