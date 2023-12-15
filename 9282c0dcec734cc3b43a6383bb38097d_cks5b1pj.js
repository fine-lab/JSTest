let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      var period1 = context.period1;
      var period2 = context.period2;
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "成本费用类");
      var codes = resSubjectType.res.codes;
      var param = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: period1, //起始期间,必填
        period2: period2, //结束期间,必填
        codes: codes
      };
      //成本code
      var costCodes = resSubjectType.res.allType["成本费用类营业成本"].codeDebit;
      //费用code
      var expCodes = resSubjectType.res.allType["成本费用类费用总额"].codeDebit;
      let funcGetSubjects = extrequire("AT17AF88F609C00004.common.getSubjects");
      let subjects = funcGetSubjects.execute(param);
      var cost = 0;
      var exp = 0;
      subjects.forEach((item) => {
        if (costCodes.includes(item.accsubject_code)) {
          cost += item.localdebit2;
        }
        if (expCodes.includes(item.accsubject_code)) {
          exp += item.localdebit2;
        }
      });
      var resultList = [
        {
          zhibiao: "成本金额",
          zhi: cost
        },
        {
          zhibiao: "费用金额",
          zhi: exp
        }
      ];
      return { resultList };
    } catch (e) {
      throw new Error("costRisk报错" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });