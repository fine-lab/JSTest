let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //保存部门到系统表
    let sstatus = param.data[0].x_status;
    param.data[0].set("x_status", sstatus);
    let request = {};
    let fun2 = extrequire("GT34544AT7.dept.deptInsert");
    request.enable = param.data[0].sysEnable;
    request.code = param.data[0].code;
    request.name = param.data[0].sysOrgName;
    request.shortname = param.data[0].sysShortname;
    if (param.data[0].sysPrent !== undefined) {
      request.par = param.data[0].sysPrent;
    }
    request.orgtype = param.data[0].sysOrgtype;
    request._status = sstatus;
    if (sstatus === "Update") {
      request.id = param.data[0].sysOrg;
    }
    let result2 = fun2.execute(request).res;
    if (result2.code === "999") {
      throw new Error("错误信息： " + JSON.stringify(result2.message));
    }
    //同步部门到自建表
    let func2 = sstatus === "Insert" ? extrequire("GT34544AT7.common.insertsql") : extrequire("GT34544AT7.common.updatesql");
    request.table = "GT34544AT7.GT34544AT7.IndustryOwnOrg";
    request.object = {
      org_level: param.data[0].orgLeve,
      own_companytype: param.data[0].ownCompanytype,
      own_enable: param.data[0].sysEnable,
      sys_code: param.data[0].code,
      sys_orgId: result2.data.id,
      sys_parent: param.data[0].sysPrent,
      parent: param.data[0].ownOrgParent,
      name: param.data[0].sysOrgName,
      shortname: param.data[0].sysShortname,
      ownSequence: param.data[0].ownSequence
    };
    if (sstatus === "Update") {
      request.object.id = param.data[0].ownOrgId;
    }
    request.billNum = "e3ef98f9SingleCard";
    let res2 = func2.execute(request).res;
    let func1 = extrequire("GT34544AT7.common.updatesql");
    request.table = "GT34544AT7.GT34544AT7.MyOrg";
    request.object = { sysOrg: result2.data.id, id: param.data[0].id, sysCode: param.data[0].code, ownOrgId: res2.id };
    let res1 = func1.execute(request).res;
    return { org: result2.data, myorg: res1, ownorg: res2 };
  }
}
exports({ entryPoint: MyTrigger });