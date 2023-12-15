let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productCode = request.param.code;
    var number = request.param.number;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where product_code = '" + productCode + "' and batch_number = '" + number + "' ";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    if (result.length == 0) {
      // 根据产品编码和生产批号在入库单未查询到数据
      throw new Error("根据产品编码和生产批号在入库单为查询到数据");
    } else {
      // 查询到数据
      return { result };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });