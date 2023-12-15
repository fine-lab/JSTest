let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      // 获取 主营业务收入6001贷 主营业务成本6401借 营业外收入6301贷 营业外支出6711借 其他业务收入6051贷 其他业务支出6402借
      // 获取 公允价值变动损益6101贷 投资收益6111贷 其他收益6112贷 税金及附加6405借 销售费用6601借 管理费用6602借 财务费用6603借 勘探费用6604借 资产减值损失6701借
      // 获取 税=应交所得税负债222131贷+递延所得税负债2901贷-递延所得税资产1811借
      // 获取 主营业务收入6001贷  营业外收入6301贷  其他业务收入6051贷 公允价值变动损益6101贷 投资收益6111贷 其他收益6112贷 应交所得税222131贷+递延所得税负债2901贷
      // 获取 主营业务成本6401借 营业外支出6711借 其他业务支出6402借 税金及附加6405借 销售费用6601借 管理费用6602借 财务费用6603借 勘探费用6604借 资产减值损失6701借 递延所得税资产1811借
      // 获取利润类中所有的科目类别，编码，借贷方向等信息，供后续使用
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(request, "利润类");
      // 定义一个json对象用于存放所有类别下的科目以及其借贷方向
      var allType = resSubjectType.res.allType;
      // 定义一个codes的list  用于存放科目编码所有
      var codes = resSubjectType.res.codes;
      // 定义一个list  存放科目名称、编码、借贷方向  用于相关信息的使用
      var subject = resSubjectType.res.subject;
      request.codes = codes;
      let funcProfitAll = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resProfitAll = funcProfitAll.execute(request);
      var functionPub = "AT17AF88F609C00004.operatingprofit.getDirectionPub";
      // 该函数用于计算科目相减，例如收入贷方借方减去成本贷方借方
      var funcSubtract = "AT17AF88F609C00004.operatingprofit.getSubtraction";
      // 获取营业收入 主营业务收入+其他业务收入贷方
      let funcIncome = extrequire(functionPub);
      let resIncome = funcIncome.execute(request, resProfitAll, allType["利润类营业收入"].codeCredit, allType["利润类营业收入"].codeDebit);
      // 获取营业成本 主营业务成本+其他业务支出借方
      let funcCost = extrequire(functionPub);
      let resCost = funcCost.execute(request, resProfitAll, allType["利润类营业成本"].codeCredit, allType["利润类营业成本"].codeDebit);
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
      let resNetProfit = funcNetProfit.execute(request, resProfitAll, netProfitOneCredit, netProfitOneDebit, netProfitTwoCredit, netProfitTwoDebit);
      let resObject = {
        resNetProfit: resNetProfit.resObject,
        resIncome: resIncome.resObject
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getCashCommon报错：" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });