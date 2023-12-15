let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //请求体封装
    var pageIndex = "1";
    var pageSize = "100";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchcode: request.productId
    };
    //调用接口
    let apiResponse = openLinker("POST", "/yonbip/scm/stock/QueryCurrentStocksByCondition", "GT100265AT156", JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });