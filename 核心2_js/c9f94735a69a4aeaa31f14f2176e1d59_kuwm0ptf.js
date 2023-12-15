let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      // 获取计算净利润的所有科目
      var profitAllCode = ["6001", "6301", "6051", "6101", "6111", "6112", "222131", "2901", "6401", "6711", "6402", "6405", "6601", "6602", "6603", "6604", "6701", "1811"];
      context.codes = profitAllCode;
      let funcProfitAll = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resProfitAll = funcProfitAll.execute(context);
      // 获取税的指标
      // 获取税 税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      let funcTax = extrequire("AT17AF88F609C00004.operatingprofit.getTax");
      let resTax = funcTax.execute(context, resProfitAll, ["222131", "2901"], ["1811"]);
      // 利润总额=营业利润+营业外收入6301-营业外支出6711
      let funcTotalProfit = extrequire("AT17AF88F609C00004.operatingprofit.getTax");
      let resTotalProfit = funcTotalProfit.execute(context, resProfitAll, ["6001", "6051", "6101", "6111", "6112", "6301"], ["6401", "6402", "6405", "6601", "6602", "6603", "6604", "6701", "6711"]);
      // 净利润 = 利润总额-税    税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      let funcNetProfit = extrequire("AT17AF88F609C00004.operatingprofit.getNetProfit");
      let resNetProfit = funcNetProfit.execute(context, resTotalProfit, resTax);
      let resObject = resNetProfit.resObject;
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getCommonProfit报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });