let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.productMasterId;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id ='" + id + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    if (result.length == 0) {
      // 查询失败
      throw new Error("查询产品注册证信息失败");
    } else {
      return { result };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });