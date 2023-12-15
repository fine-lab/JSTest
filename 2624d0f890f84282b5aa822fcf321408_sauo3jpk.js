let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    // 查询要货计划供应商，对应删除供应商的要货计划
    var object = { po_number: code };
    var res = ObjectStore.deleteByMap("GT37595AT2.GT37595AT2.shippingschedule", object, "shippingschedule");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });