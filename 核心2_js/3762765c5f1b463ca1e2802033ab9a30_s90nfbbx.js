let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { pageIndex: 1, pageSize: 10, isSum: false };
    let header = {};
    let apiResponse = apiman(
      "POST",
      "https://www.example.com/",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    return { resultData: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });