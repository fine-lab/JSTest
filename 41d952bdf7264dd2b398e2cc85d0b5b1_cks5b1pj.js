let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      // 获取利润类中所有的科目类别，编码，借贷方向等信息，供后续使用
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "利润类");
      // 定义一个json对象用于存放所有类别下的科目以及其借贷方向
      var allType = resSubjectType.res.allType;
      // 定义一个codes的list  用于存放科目编码所有
      var codes = resSubjectType.res.codes;
      // 定义一个list  存放科目名称、编码、借贷方向  用于相关信息的使用
      var subject = resSubjectType.res.subject;
      context.codes = codes;
      let funcProfitAll = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resProfitAll = funcProfitAll.execute(context);
      // 该函数用于计算科目相减，例如收入贷方借方减去成本贷方借方
      var funcSubtract = "AT17AF88F609C00004.operatingprofit.getSubtraction";
      // 净利润 = 利润总额-税    税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      let netProfitOneCredit = allType["利润类营业收入"].codeCredit
        .concat(allType["利润类其他收益"].codeCredit)
        .concat(allType["利润类营业外收入"].codeCredit)
        .concat(allType["利润类税费资产类税费"].codeCredit);
      let netProfitOneDebit = allType["利润类营业收入"].codeDebit
        .concat(allType["利润类其他收益"].codeDebit)
        .concat(allType["利润类营业外收入"].codeDebit)
        .concat(allType["利润类税费资产类税费"].codeDebit);
      let netProfitTwoCredit = allType["利润类营业成本"].codeCredit
        .concat(allType["利润类费用期间费用"].codeCredit)
        .concat(allType["利润类费用税金"].codeCredit)
        .concat(allType["利润类费用其他损失"].codeCredit)
        .concat(allType["利润类营业外支出"].codeCredit)
        .concat(allType["利润类税费负债类税费"].codeCredit);
      let netProfitTwoDebit = allType["利润类营业成本"].codeDebit
        .concat(allType["利润类费用期间费用"].codeDebit)
        .concat(allType["利润类费用税金"].codeDebit)
        .concat(allType["利润类费用其他损失"].codeDebit)
        .concat(allType["利润类营业外支出"].codeDebit)
        .concat(allType["利润类税费负债类税费"].codeDebit);
      let funcNetProfit = extrequire(funcSubtract);
      let resNetProfit = funcNetProfit.execute(context, resProfitAll, netProfitOneCredit, netProfitOneDebit, netProfitTwoCredit, netProfitTwoDebit);
      // 保留两位小数  MoneyFormatReturnBd(value,pointnumber);
      let pointnumber = 2;
      let strNetProfit = MoneyFormatReturnBd(resNetProfit.resObject.currentPeriod, pointnumber);
      // 返回净利润值
      var resultList = [];
      var result = {
        zhibiao: "净利润",
        zhi: strNetProfit
      };
      resultList.push(result);
      return { resultList };
    } catch (e) {
      throw new Error("执行脚本profitRisk报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });