let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let getUserNameYonql = "select name from base.user.BipUser where id = '" + ObjectStore.user().id + "'";
    let getUserNameRes = ObjectStore.queryByYonQL(getUserNameYonql, "bip-usercenter");
    let userName = getUserNameRes[0].name;
    let recheckMan;
    let recheckMan_name;
    let recheckDept;
    let recheckDept_name;
    let res = extrequire("GT22176AT10.publicFunction.getStaffOfCurUser").execute({ mainOrgId: param.data[0].org_id });
    if (res != undefined && res.staffOfCurrentUser != undefined) {
      recheckMan = res.staffOfCurrentUser.id;
      recheckMan_name = res.staffOfCurrentUser.name;
      if (recheckDept == "" || recheckDept == null) {
        recheckDept = res.staffOfCurrentUser.deptId;
        recheckDept_name = res.staffOfCurrentUser.deptName;
      }
    }
    for (let i = 0; i < param.data.length; i++) {
      param.data[i].set("auditor", userName);
      param.data[i].set("auditTime", new Date());
      //销售出库复核更新复核人员，部门
      if (context.fullname == "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6") {
        if (recheckMan != undefined) {
          param.data[i].set("recheckMan", recheckMan);
          param.data[i].set("recheckMan_name", recheckMan_name);
        }
        if (recheckDept != undefined) {
          param.data[i].set("recheckDept", recheckDept);
          param.data[i].set("recheckDept_name", recheckDept_name);
        }
      }
      //购进入库验收更新复核人员，部门
      if (context.fullname == "GT22176AT10.GT22176AT10.SY01_purinstockysv2") {
        if (recheckMan != undefined) {
          param.data[i].set("inspecter", recheckMan);
          param.data[i].set("inspecter_name", recheckMan_name);
        }
        if (recheckDept != undefined) {
          param.data[i].set("inspectDep", recheckDept);
          param.data[i].set("inspectDep_name", recheckDept_name);
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });