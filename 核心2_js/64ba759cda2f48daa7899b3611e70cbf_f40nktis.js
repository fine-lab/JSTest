let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = request.period1;
      var endPeriod = request.period2;
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(request, "利润类");
      return { resSubjectType };
      let func = extrequire("AT17AF88F609C00004.profitAnalysis.profitRisk");
      let res1 = func.execute(request);
      request.period1 = startPeriod;
      request.period2 = endPeriod;
      let func2 = extrequire("AT17AF88F609C00004.incomeAnalysis.incomeRisk");
      let res2 = func2.execute(request);
      let url = ObjectStore.env().url;
      let x = [request, res1, res2];
      return { x };
    } catch (e) {
      throw new Error("执行脚本getProfitApiTest报错：" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });