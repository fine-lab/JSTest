let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查询sql
    var querySql = "select * from GT80750AT4.GT80750AT4.sale_order_record where 1=1 ";
    // 查询条件
    if (request.code !== undefined) {
      querySql += " and code = '" + request.code + "' ";
    }
    if (request.is_success !== undefined) {
      querySql += " and is_success = '" + request.is_success + "' ";
    }
    // 返回信息
    var res = ObjectStore.queryByYonQL(querySql);
    // 响应
    return { code: 200, data: res };
  }
}
exports({ entryPoint: MyAPIHandler });