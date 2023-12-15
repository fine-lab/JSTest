let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let kehufenlei = request.kehufenlei;
    let productConditions = request._productConditions;
    let sql = "select price,b.productId productId from marketing.price.PriceRecord inner join marketing.price.PriceRecordDimension b on id = b.priceRecordId where enable = '1'";
    sql += " and b.productId in (" + productConditions + ") and b.agentClassId = '" + kehufenlei + "'";
    let res = ObjectStore.queryByYonQL(sql, "marketingbill"); //因为是调用标准版构建的应用，所以必须传递第二个参数：developplatform
    let resMap = {};
    for (let i = 0; i < res.length; i++) {
      resMap[kehufenlei + res[i].productId] = res[i];
    }
    return { res: resMap };
  }
}
exports({ entryPoint: MyAPIHandler });