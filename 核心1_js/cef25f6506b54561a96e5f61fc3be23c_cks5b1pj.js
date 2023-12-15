let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(request, "ROE");
      let allType = resSubjectType.res.allType;
      var codes = resSubjectType.res.codes;
      request.codes = codes;
      let funcProfitAll = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resAll = funcProfitAll.execute(request);
      var functionPub = "AT17AF88F609C00004.operatingprofit.getDirectionPub";
      // 该函数用于计算科目相减，例如收入贷方借方减去成本贷方借方
      var funcSubtract = "AT17AF88F609C00004.operatingprofit.getSubtraction";
      // 获取营业收入 主营业务收入+其他业务收入贷方
      let funcIncome = extrequire(functionPub);
      let resIncome = funcIncome.execute(request, resAll, allType["ROE营业收入"].codeCredit, allType["ROE营业收入"].codeDebit);
      // 获取营业成本 主营业务成本+其他业务支出借方
      let funcCost = extrequire(functionPub);
      let resCost = funcCost.execute(request, resAll, allType["ROE营业成本"].codeCredit, allType["ROE营业成本"].codeDebit);
      // 净利润 = 利润总额-税    税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      let netProfitOneCredit = allType["ROE营业收入"].codeCredit.concat(allType["ROE其他收益"].codeCredit).concat(allType["ROE营业外收入"].codeCredit).concat(allType["ROE税费资产类税费"].codeCredit);
      let netProfitOneDebit = allType["ROE营业收入"].codeDebit.concat(allType["ROE其他收益"].codeDebit).concat(allType["ROE营业外收入"].codeDebit).concat(allType["ROE税费资产类税费"].codeDebit);
      let netProfitTwoCredit = allType["ROE营业成本"].codeCredit
        .concat(allType["ROE费用期间费用"].codeCredit)
        .concat(allType["ROE费用税金"].codeCredit)
        .concat(allType["ROE费用其他损失"].codeCredit)
        .concat(allType["ROE营业外支出"].codeCredit)
        .concat(allType["ROE税费负债类税费"].codeCredit);
      let netProfitTwoDebit = allType["ROE营业成本"].codeDebit
        .concat(allType["ROE费用期间费用"].codeDebit)
        .concat(allType["ROE费用税金"].codeDebit)
        .concat(allType["ROE费用其他损失"].codeDebit)
        .concat(allType["ROE营业外支出"].codeDebit)
        .concat(allType["ROE税费负债类税费"].codeDebit);
      let funcNetProfit = extrequire(funcSubtract);
      let resNetProfit = funcNetProfit.execute(request, resAll, netProfitOneCredit, netProfitOneDebit, netProfitTwoCredit, netProfitTwoDebit);
      let funcMoney = extrequire(functionPub);
      let resMoney = funcMoney.execute(request, resAll, allType["ROE费用总额"].codeCredit, allType["ROE费用总额"].codeDebit);
      //获取计算结果
      let getCalculation = extrequire("AT17AF88F609C00004.AssetsLiabilities.getCalculation");
      //资产信息计算
      var resAsset = getCalculation.execute(request, resAll, allType["ROE资产"].codeDebit, "localdebit2", "-", "localcredebit2");
      //负债信息计算
      var resLiability = getCalculation.execute(request, resAll, allType["ROE负债"].codeCredit, "localcredebit2", "-", "localdebit2");
      //所有者权益信息计算
      let funcOwnereQuityAll = extrequire("AT17AF88F609C00004.roe.getOwnereQuity");
      let resOwnereQuity = funcOwnereQuityAll.execute(request);
      let resObject = {
        resNetProfit: resNetProfit.resObject,
        resCost: resCost.resObject,
        resIncome: resIncome.resObject,
        resMoney: resMoney.resObject,
        resAsset: resAsset.resObject,
        resLiability: resLiability.resObject,
        resOwnereQuity: resOwnereQuity.resObject
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getRoeCommon报错：" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });