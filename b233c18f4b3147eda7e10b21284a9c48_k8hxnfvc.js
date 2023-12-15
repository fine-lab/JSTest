let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let billnums = [];
    billnums.push("znbzbx_expensebill"); //通用报销单
    billnums.push("znbzbx_expensebill_m"); //通用报销单
    billnums.push("znbzbx_travelexpbill"); //差旅报销单
    billnums.push("znbzbx_loanbill"); //个人借款单
    billnums.push("znbzbx_pubprepay"); //对公预付单
    billnums.push("znbzbx_returnbill"); //还款单
    billnums.push("znbzbx_busistrip"); //出差申请单
    billnums.push("znbzbx_memoapplyalter"); //通用申请变更单
    billnums.push("znbzbx_memoapply"); //通用申请单
    billnums.push("znbzbx_busistripalter"); //出差申请变更单
    billnums.push("znbzbx_refundbill"); //退款单
    if (billnums.includes(param.billnum) && (param.refCode == "ucfbasedoc.bd_projectNewRef" || param.refCode == "znbzbx.bd_projectref" || param.refCode == "bd_projectref")) {
      if (param.key == "pk_project_name") {
        let param1 = {
          projectType: "0",
          personId: data.pk_handlepsn,
          orgId: data.cfinaceorg,
          deptId: data.vfinacedeptid
        };
        let queryProject = extrequire("APCT.backDesignerFunction.queryProject");
        let res = queryProject.execute(param1);
        this.updateContext.filters = {
          condition: {
            simpleVOs: [
              {
                field: "code",
                op: "in",
                value1: res.ret //['000100017030017_0001','000100017030018_0001']//
              }
            ]
          }
        };
      }
      if (param.key == "expensebilluserdefs!define10_name") {
        let param1 = {
          projectType: "1",
          personId: data.pk_handlepsn,
          orgId: data.cfinaceorg,
          deptId: data.vfinacedeptid
        };
        let queryProject = extrequire("APCT.backDesignerFunction.queryProject");
        let res = queryProject.execute(param1);
        this.updateContext.filters = {
          treeCondition: {
            simpleVOs: [
              {
                field: "code",
                op: "in",
                value1: res.ret
              }
            ]
          }
        };
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });