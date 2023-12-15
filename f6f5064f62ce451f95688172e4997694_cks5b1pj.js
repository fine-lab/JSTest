let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      var period1 = context.period1;
      var period2 = context.period2;
      // 获取收入类中所有的科目类别，编码，借贷方向等信息，供后续使用
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "收入类");
      // 定义一个codes的list  用于存放科目编码所有
      var codes = resSubjectType.res.codes;
      var param = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: period1, //起始期间,必填
        period2: period2, //结束期间,必填
        codes: codes
      };
      // 获取收入 一般来说为主营业务+其他业务收入
      let funcIncome = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resIncome = funcIncome.execute(param);
      // 获取收入的所有指标信息
      let func = extrequire("AT17AF88F609C00004.operatingincome.getIncomeAll");
      let res = func.execute(param, resIncome, codes);
      // 保留两位小数  MoneyFormatReturnBd(value,pointnumber);
      let pointnumber = 2;
      let strIncome = MoneyFormatReturnBd(res.resObject.currentPeriod, pointnumber);
      // 返回营业收入值
      var resultList = [];
      var result = {
        zhibiao: "营业收入",
        zhi: strIncome
      };
      resultList.push(result);
      return { resultList };
    } catch (e) {
      throw new Error("执行脚本incomeRisk报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });