let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 产品编码
    var code = request.param.code;
    // 生产批号
    var number = request.param.number;
    // 查询产品信息表
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id = '" + code + "'";
    var productResult = ObjectStore.queryByYonQL(sql, "developplatform");
    // 取产品编码
    var product_coding = productResult[0].product_coding;
    let ContentType = "text/plain;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let body = {
      sku: product_coding,
      batch_nbr: number
    };
    //实体查询
    var res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory", body);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });