let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var param1 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: context.period1, //起始期间,必填
      period2: context.period2, //结束期间,必填
      codes: ["6405"] //生产成本5001+劳务成本5201+主营业务成本6401 //销售费用6601：管理费用6602：财务费用6603
    };
    let func = extrequire("AT17AF88F609C00004.common.getSubjects");
    let taxesList = func.execute(param1);
    return { taxesList };
  }
}
exports({ entryPoint: MyTrigger });