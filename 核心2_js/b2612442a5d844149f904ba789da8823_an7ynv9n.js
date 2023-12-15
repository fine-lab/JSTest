let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var saleOrder = postman("post", config.nccUrl + "/servlet/saveSaleOrder", "", JSON.stringify(JSON.parse(request.data)));
    try {
      saleOrder = JSON.parse(saleOrder);
      if (saleOrder.code !== 200) {
        throw new Error(saleOrder.message);
      }
    } catch (e) {
      throw new Error("ncc重推销售订单 " + e);
    }
    return saleOrder;
  }
}
exports({ entryPoint: MyAPIHandler });