let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    // 获取利润类中所有的科目类别，编码，借贷方向等信息，供后续使用
    let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
    let resSubjectType = funcSubjectType.execute(context, "成本类");
    // 定义一个json对象用于存放所有类别下的科目以及其借贷方向
    var allType = resSubjectType.res.allType;
    // 定义一个codes的list  用于存放科目编码所有
    var codes = resSubjectType.res.codes;
    // 定义一个list  存放科目名称、编码、借贷方向  用于相关信息的使用
    var subject = resSubjectType.res.subject;
    var param1 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: context.period1, //起始期间,必填
      period2: context.period2, //结束期间,必填
      codes: codes //生产成本5001+劳务成本5201+主营业务成本6401 //销售费用6601：管理费用6602：财务费用6603
    };
    let func = extrequire("AT17AF88F609C00004.common.getSubjects");
    let costList = func.execute(param1);
    var costs = 0;
    costList.forEach((item) => {
      costs += item.localdebit2;
    });
    var res = {
      costs: costs
    };
    return { res };
  }
}
exports({ entryPoint: MyTrigger });