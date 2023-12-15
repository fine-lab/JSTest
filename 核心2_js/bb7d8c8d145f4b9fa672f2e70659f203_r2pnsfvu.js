let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateWrapper = new Wrapper();
    updateWrapper.isNull("SaleArea");
    // 待更新字段内容
    var toUpdate = { SaleArea: "2051800557033472" };
    // 执行更新
    var res = ObjectStore.update("GT7239AT6.GT7239AT6.cmmssn_merchant_h", toUpdate, updateWrapper, "6b5dbd6a");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });