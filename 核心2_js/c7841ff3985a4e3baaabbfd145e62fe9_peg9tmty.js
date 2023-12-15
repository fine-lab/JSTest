let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productCode = request.param.code;
    var number = request.param.number;
    var sku = request.param.sku;
    var sql =
      " SELECT dr, " +
      " WarehousingAcceptanceSheet_id as WarehousingAcceptanceSheet_id, " +
      " new26 as new26, " +
      " date_manufacture as date_manufacture, " +
      " term_validity as term_validity, " +
      " product_name as product_name, " +
      " registration_number as registration_number, " +
      " Company as Company, " +
      " conditions as conditions, " +
      " Location_No as Location_No, " +
      " registrant as registrant, " +
      " ui as ui, " +
      " di as di, " +
      " udi as udi " +
      " FROM AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis " +
      " LEFT JOIN AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation productInfo ON productInfo.id = product_code " +
      " WHERE batch_number = '" +
      number +
      "' and productInfo.product_coding = '" +
      sku +
      "'  ";
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