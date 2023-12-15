let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    var product = data.productId;
    //组织id
    let org = data.org;
    var terminal = data.terminal;
    //                      已发放数量           台账数据主表
    //已发放数量:provideQuantity
    //申领数量：applyQuantity
    //结存数量：existQuantity
    var datesql = "select existQuantity from dsfa.assetstandbook.AssetsStandBook where org = '" + org + "' and  product in '" + product + "' and terminal = '" + terminal + "'";
    var historicalNum = ObjectStore.queryByYonQL(datesql, "yycrm");
    return { historicalNum };
  }
}
exports({
  entryPoint: MyAPIHandler
});