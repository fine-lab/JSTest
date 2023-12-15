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
        if (res.staffOfCurrentUser.GSPConfigDefaultUser != undefined) {
          defaultYsr = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultYsr;
          defaultYsrName = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultYsrName;
          defaultYsrDep = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultYsrDep;
          defaultYsrDepName = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultYsrDepName;
          defaultFhr = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhr;
          defaultFhrName = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrName;
          defaultFhrDep = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrDep;
          defaultFhrDepName = res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrDepName;
        }
      }
      param.data[i].set("auditor", userName);
      param.data[i].set("auditTime", new Date());
      let updateJson = {
        id: param.data[i].id,
        _status: "Update"
      };
      //销售出库复核更新复核人员，部门
      if (context.fullname == "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6") {
        if (defaultFhr == undefined && recheckMan != undefined) {
          updateJson.recheckMan = recheckMan;
          updateJson.recheckDept = recheckDept;
        }
        if (defaultFhr != undefined) {
          updateJson.recheckMan = defaultFhr;
          updateJson.recheckDept = defaultFhrDep;
        }
        ObjectStore.updateById("GT22176AT10.GT22176AT10.sy01_saleoutstofhv6", updateJson, "9c79daf5");
      }
      //购进入库验收更新复核人员，部门
      if (context.fullname == "GT22176AT10.GT22176AT10.SY01_purinstockysv2") {
        if (defaultYsr == undefined && recheckMan != undefined) {
          updateJson.inspecter = recheckMan;
          updateJson.inspectDep = recheckDept;
        }
        if (defaultYsr != undefined) {
          updateJson.inspecter = defaultYsr;
          updateJson.inspectDep = defaultYsrDep;
        }
        ObjectStore.updateById("GT22176AT10.GT22176AT10.SY01_purinstockysv2", updateJson, "a2835a96");
      }
    }
  }
}
exports({ entryPoint: MyTrigger });