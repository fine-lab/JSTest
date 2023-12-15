let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(context) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = context.period1;
      var endPeriod = context.period2;
      // 获取销售订单数据
      let funcSale = extrequire("AT17AF88F609C00004.sale.getBackForSales");
      let resSale = funcSale.execute(context);
      // 重置筛选期间
      context.period1 = startPeriod;
      context.period2 = endPeriod;
      // 获取销售退货数据
      let funcReturn = extrequire("AT17AF88F609C00004.sale.getBackForReturn");
      let resReturn = funcReturn.execute(context);
      let resObject = {
        resReturn: resReturn,
        resSale: resSale
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getSalesOrder报错：" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });