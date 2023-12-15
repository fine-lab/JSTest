let AbstractAPIHandler = require("AbstractAPIHandler");
// 类名含有API字样说明是api函数
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pageIndex = "0";
    var pageSize = "10";
    debugger;
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchcode: request.telephone
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1619118217600004", JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });