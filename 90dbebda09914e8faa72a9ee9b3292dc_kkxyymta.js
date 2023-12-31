let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      let getUserNameYonql = "select name from base.user.BipUser where id = '" + ObjectStore.user().id + "'";
      let getUserNameRes = ObjectStore.queryByYonQL(getUserNameYonql, "bip-usercenter");
      let userName = getUserNameRes[0].name;
      let recheckMan;
      let recheckMan_name;
      let recheckDept;
      let recheckDept_name;
      let defaultYsr;
      let defaultYsrName;
      let defaultYsrDep;
      let defaultYsrDepName;
      let defaultFhr;
      let defaultFhrName;
      let defaultFhrDep;
      let defaultFhrDepName;
      let mainOrgId;
      for (let i = 0; i < param.data.length; i++) {
        let selectOrgId = "select id,org_id from " + context.fullname + " where id = '" + param.data[0].id + "'";
        mainOrgId = ObjectStore.queryByYonQL(selectOrgId, "sy01")[0].org_id;
        let res = extrequire("GT22176AT10.publicFunction.getStaffOfCurUser").execute({ mainOrgId: mainOrgId });
        if (res != undefined && res.staffOfCurrentUser != undefined) {
          recheckMan = res.staffOfCurrentUser.id;
          recheckMan_name = res.staffOfCurrentUser.name;
          recheckDept = res.staffOfCurrentUser.deptId;
          recheckDept_name = res.staffOfCurrentUser.deptName;
          defaultYsr = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultYsr;
          defaultYsrName = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultYsrName;
          defaultYsrDep = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultYsrDep;
          defaultYsrDepName = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultYsrDepName;
          defaultFhr = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhr;
          defaultFhrName = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrName;
          defaultFhrDep = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrDep;
          defaultFhrDepName = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrDepName;
        }
        param.data[i].set("auditor", userName);
        param.data[i].set("auditTime", new Date());
        //销售出库复核更新复核人员，部门
        if (context.fullname == "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6") {
          if (defaultFhr == undefined && recheckMan != undefined) {
            param.data[i].set("recheckMan", recheckMan);
            param.data[i].set("recheckMan_name", recheckMan_name);
            param.data[i].set("recheckDept", recheckDept);
            param.data[i].set("recheckDept_name", recheckDept_name);
          }
          if (defaultFhr != undefined) {
            param.data[i].set("recheckMan", defaultFhr);
            param.data[i].set("recheckMan_name", defaultFhrName);
            param.data[i].set("recheckDept", defaultFhrDep);
            param.data[i].set("recheckDept_name", defaultFhrDepName);
          }
        }
        //购进入库验收更新复核人员，部门
        if (context.fullname == "GT22176AT10.GT22176AT10.SY01_purinstockysv2") {
          if (defaultYsr == undefined && recheckMan != undefined) {
            param.data[i].set("inspecter", recheckMan);
            param.data[i].set("inspecter_name", recheckMan_name);
            param.data[i].set("inspectDep", recheckDept);
            param.data[i].set("inspectDep_name", recheckDept_name);
          }
          if (defaultYsr != undefined) {
            param.data[i].set("inspecter", defaultYsr);
            param.data[i].set("inspecter_name", defaultYsrName);
            param.data[i].set("inspectDep", defaultYsrDep);
            param.data[i].set("inspectDep_name", defaultYsrDepName);
          }
        }
      }
    } catch (err) {}
  }
}
exports({ entryPoint: MyTrigger });