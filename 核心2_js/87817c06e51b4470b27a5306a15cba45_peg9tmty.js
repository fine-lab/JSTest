let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sku = request.data.sku;
    var productsql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where product_coding = '" + sku + "'";
    var productResult = ObjectStore.queryByYonQL(productsql, "developplatform");
    if (productResult.length == 0) {
      throw new Error("根据产品编码：'" + sku + "'查询产品信息失败");
    }
    // 产品编码唯一，获取产品信息的Id;
    var productId = productResult[0].id;
    var batchNbr = request.data.batchNbr;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where product_code = '" + productId + "' and batch_number = '" + batchNbr + "'";
    var asnResult = ObjectStore.queryByYonQL(sql, "developplatform");
    if (asnResult.length == 0) {
      throw new Error("根据产品编码Id：'" + sku + "',生产批号：'" + batchNbr + "'查询到货产品明细失败");
    } else {
      return { asnResult };
    }
  }
}
exports({ entryPoint: MyAPIHandler });