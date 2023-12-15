let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //请求体封装
    var pageIndex = "1";
    var pageSize = "10";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      //手机号
      searchcode: request.telephone
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1832AE3609F80004", JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });