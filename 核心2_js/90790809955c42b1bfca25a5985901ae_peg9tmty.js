let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sku = request.sku;
    var batchNBR = request.batchNBR;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where product_code.product_coding = '" + sku + "' and batch_number = '" + batchNBR + "' and dr=0";
    var result = ObjectStore.queryByYonQL(sql);
    if (result.length == 0) {
      // 根据产品编码和生产批号在入库单未查询到数据
      throw new Error("根据产品编码和生产批号在入库单未查询到数据");
    } else {
      // 查询到数据
      return { result };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });